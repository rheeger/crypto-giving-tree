## CHARIDAO BACK-END SETUP

## GOOGLE CLOUD COMPUTE
1. SSH into VM instances:

API: 
///
gcloud compute --project "the-charity-forest" ssh --zone "us-central1-a" "forest-api"
///
MONGO:
///
gcloud compute --project "the-charity-forest" ssh --zone "us-central1-a" "forest-client"
///
CLIENT: 
///
gcloud compute --project "the-charity-forest" ssh --zone "us-central1-a" "forest-mongo"
///

sudo nohup nodejs server.js --be_ip \
    <10.128.0.4> --fe_ip \
    <10.128.0.3> &
2.
///
///

3.
///
///

4.
///
///

5.
///
///

6.
///
///

##LOCALHOST
1.
///
npm run dev
///


