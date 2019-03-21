import os
import sys
uri = "need to know"
default_tag = "latest"
def script(version=default_tag):
    default_image=uri+":"+version
    os.system("sudo docker build -t "+default_image+" .")
    os.system("sudo docker push " + default_image)
script(sys.argv[1])
