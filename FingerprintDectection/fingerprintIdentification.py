import sys
import cv2
from matplotlib import pyplot
import base64
from base64 import * 
from PIL import Image
import mysql.connector
# function to cinvert data
def convert_data(data, file_name):
    # Convert binary format to images
    # or files data(with given file_name)
    with open(file_name, 'wb') as file:
        file.write(data)
# function to cinvert data
def convert_data(data, file_name):
    # Convert binary format to images
    # or files data(with given file_name)
    with open(file_name, 'wb') as file:
        file.write(data)


try:
    connection = mysql.connector.connect(host='localhost',
                                        database='election',
                                        user='root',
                                        password='')
    cursor = connection.cursor()
    # getting data by id value
    query = """ SELECT * from voter where voter_id = %s """
    id = sys.argv[1]
    cursor.execute(query, (id,))
    records = cursor.fetchall()

    convert_data(records[0][9], "./public/uploads/mainFingerprintImage.bmp")

except mysql.connector.Error as error:
    print(format(error))

finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
matcher = cv2.FlannBasedMatcher(dict(algorithm=1, trees=10), dict())
sift = cv2.SIFT_create()
image  = cv2.imread('./public/uploads/'+sys.argv[2])
image2  = cv2.imread('./public/uploads/mainFingerprintImage.bmp')
keypoint, descriptor = sift.detectAndCompute(image, None)
keypoint, descriptor1 = sift.detectAndCompute(image2, None)
knn_matches = matcher.knnMatch(descriptor, descriptor1, 2)
good_points = []
for m, n in knn_matches:
    if m.distance < 0.7 * n.distance:
        good_points.append(m)

if len(good_points) >  100:#Min_numbers_of_points
     print(1)
else:
    print(0)



