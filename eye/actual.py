import cv2
from gaze_tracking import GazeTracking
from ultralytics import YOLO

# Initialize the gaze tracking model
gaze = GazeTracking()

# Initialize the YOLO model
model = YOLO('yolov8n.pt')  # 'n' = nano (small and fast)

# Start the webcam
webcam = cv2.VideoCapture(0)

while True:
    # Read a frame from the webcam
    ret, frame = webcam.read()
    if not ret:
        break

    # Initialize distraction and focus variables
    distracted = False
    unfocused = False

    # Process the frame with the gaze tracking model
    gaze.refresh(frame)
    gaze_frame = gaze.annotated_frame()
    gaze_text = ""

    if gaze.is_right():
        gaze_text = "Looking right"
    elif gaze.is_left():
        gaze_text = "Looking left"
    elif gaze.is_center():
        gaze_text = "Looking center"
    elif gaze.is_up():
        gaze_text = "Looking up"
    elif gaze.is_down():
        gaze_text = "Looking down"

    cv2.putText(gaze_frame, gaze_text, (60, 60), cv2.FONT_HERSHEY_DUPLEX, 2, (255, 0, 0), 2)

    # Process the frame with the YOLO model
    phone_detected = False
    results = model.predict(source=frame, save=False, verbose=False, conf=0.5)

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])  # Class ID (number)
            label = model.names[cls_id]  # Class name (text)

            if label == "cell phone":  # If it's a phone
                phone_detected = True
                x1, y1, x2, y2 = map(int, box.xyxy[0])  # Rectangle corners
                cv2.rectangle(gaze_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(gaze_frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Determine distraction and focus states
    if gaze.is_down():
        if phone_detected:
            distracted = True
    elif gaze.is_center() and not phone_detected:
        distracted = False
    else:
        distracted = True

    # Display distraction and focus states for debugging
    cv2.putText(gaze_frame, f"Distracted: {distracted}", (60, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

    # Display the combined frame
    cv2.imshow("Demo", gaze_frame)

    # Exit if the ESC key is pressed
    if cv2.waitKey(1) == 27:
        break

# Release resources
webcam.release()
cv2.destroyAllWindows()

