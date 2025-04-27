from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
from gaze_tracking import GazeTracking
from ultralytics import YOLO
import base64
from io import BytesIO

app = Flask(__name__)

# Enable CORS for React app running on localhost:5173
# Allow all origins for the '/process_frame' route
CORS(app, resources={r"/process_frame": {"origins": "*", "methods": ["POST"]}})

# Initialize models
gaze = GazeTracking()
model = YOLO('yolov8n.pt')  # Initialize YOLO model

@app.route('/process_frame', methods=['POST'])
def process_frame():
    try:
        # Get the frame data from the POST request
        data = request.get_json()
        frame_data = data['frame']
        
        # Decode the base64 frame
        img_data = base64.b64decode(frame_data.split(',')[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        # Process the frame with the gaze tracking model
        gaze.refresh(frame)
        gaze_frame = gaze.annotated_frame()

        # Process the frame with the YOLO model (detecting objects like phones)
        phone_detected = False
        results = model.predict(source=frame, save=False, verbose=False, conf=0.5)

        # Detect phones in the frame
        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])  # Class ID (number)
                label = model.names[cls_id]  # Class name (text)

                if label == "cell phone":  # If it's a phone
                    phone_detected = True
                    x1, y1, x2, y2 = map(int, box.xyxy[0])  # Rectangle corners
                    cv2.rectangle(gaze_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(gaze_frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Check gaze and determine distraction status
        distracted = False
        if gaze.is_down():
            if phone_detected:
                distracted = True
        elif gaze.is_center() and not phone_detected:
            distracted = False
        else:
            distracted = True
        
        # Add distraction status text to frame
        cv2.putText(gaze_frame, f"Distracted: {distracted}", (60, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        # Convert the processed frame to base64 for sending back to the frontend
        _, buffer = cv2.imencode('.jpg', gaze_frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Return the processed frame with distraction status
        return jsonify({
            'status': 'ok',
            'frame': f"data:image/jpeg;base64,{frame_base64}",
            'distracted': distracted  # Include distraction status
        })
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)  # Set port to 5001
