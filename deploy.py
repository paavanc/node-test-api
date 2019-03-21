import os
import sys
uri = "need to know"
default_tag = "latest"
dev_context = "dev-context"
deployment = "node-starter-deployment"
containter_tag = "node-starter-server"
def script(version=default_tag, environment =dev_context ):
    os.system("kubectl config use-context "+environment)
    os.system("kubectl set image deployment/"+deployment+" "+containter_tag+"="+uri+":"+version)
    os.system("kubectl patch deployment "+deployment+" -p \"{\\\"spec\\\":{\\\"template\\\":{\\\"metadata\\\":{\\\"labels\\\":{\\\"date\\\":\\\"`date +'%s'`\\\"}}}}}\" ")
script(sys.argv[1],sys.argv[2])
