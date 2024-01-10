# Software Engineering for the Cloud - Project (2024)


Promo 2024, Groupe SE2
* Karam MANSOUR
* Sofian YAHYAOUI
* Ayyoub ZEBDA

## Exécution

Ajoutez la ligne `127.0.0.1 todo-app.local` dans le fichier suivant :
- `/etc/host` si Linux
- `C:/Windows/System32/drivers/etc/host` si Windows


Executez les commandes suivantes à la racine du projet (Assurez vous d'avoir executé Docker en arrière plan) :
```bash
minikube start

kubectl apply -f ./todo-app-deployment.yml

minikube addons enable ingress
kubectl apply -f ingress.yml
minikube tunnel
```

L'application devrait être accessible sur votre navigateur depuis le lien suivant : `http://todo-app.local/`