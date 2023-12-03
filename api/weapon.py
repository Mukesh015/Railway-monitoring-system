import cv2
import numpy as np
import dlib
from win10toast import ToastNotifier
import pyttsx3
from notifypy import Notify


def weapon_detection(cap):
    detector = dlib.get_frontal_face_detector()
    net = cv2.dnn.readNet("yolov3_training_2000.weights", "yolov3_testing.cfg")
    classes = ["Weapon"]
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
    colors = np.random.uniform(0, 255, size=(len(classes), 3))
    while True:
        _, img = cap.read()
        height, width, channels = img.shape
        blob = cv2.dnn.blobFromImage(img, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(output_layers)
        class_ids = []
        confidences = []
        boxes = []
        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5:
                    center_x = int(detection[0] * width)
                    center_y = int(detection[1] * height)
                    w = int(detection[2] * width)
                    h = int(detection[3] * height)
                    x = int(center_x - w / 2)
                    y = int(center_y - h / 2)
                    boxes.append([x, y, w, h])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)
        indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
        print(indexes)
        if indexes == 0: 
            s=f"Weapon detected in platform"
            notification = Notify()
            notification.title = "warning"
            notification.message = f"{s}"
            notification.urgency = "critical"
            notification.icon = "C:\\Users\\Subhajit kundu\\Desktop\\railway-monitoring-system\\api\\warning.ico"
            notification.timeout = 100000
            notification.send()
            toast = ToastNotifier()
            speaker = pyttsx3.init()
            speaker.setProperty('rate', 170)
            speaker.say(f"{s}")
            speaker.runAndWait()
        font = cv2.FONT_HERSHEY_PLAIN
        for i in range(len(boxes)):
            if i in indexes:
                x, y, w, h = boxes[i]
                label = str(classes[class_ids[i]])
                color = colors[class_ids[i]]
                cv2.rectangle(img, (x, y), (x + w, y + h), color, 2)
                cv2.putText(img, label, (x, y + 30), font, 3, color, 3)
        # cv2.imshow("Image", img)
        key = cv2.waitKey(1)
        # ret, frame = cap.read()
        img = cv2.flip(img, 1)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)
        i = 0
        for face in faces:
            x, y = face.left(), face.top()
            x1, y1 = face.right(), face.bottom()
            cv2.rectangle(img, (x, y), (x1, y1), (0, 255, 0), 2)
            i = i+1
            cv2.putText(img, 'face num'+str(i), (x-10, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            print(face, i)
        cv2.imshow('frame', img)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

    
cap = cv2.VideoCapture(0)
weapon_detection(cap)