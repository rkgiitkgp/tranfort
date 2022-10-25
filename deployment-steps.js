// docker build -t truck-app .
// docker run -p 8888:3000 truck-app // for testing whether container is working or not
//1. tag image to gcr.io
// $ docker tag truck-app gcr.io/transfort-366614/truck-app
// 2. push the container to gcp container registry
// $ gcloud docker -- push gcr.io/transfort-366614/truck-app
