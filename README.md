# ProjetN°7-Groupomania

## Database setup
Vous devez tout d'abord avoir MySQL d'installer sur votre machine.

Créer une base de donnée nommée *groupomania*, vous devrez ensuite créer une table *post*, et une table *utilisateur*
en suivant le schéma du document 'database_setup' qui se trouve dans le dossier *config* du dossier backend.

Ce dossier contient un autre fichier nommé *db.js* qui permet de se connecter à la base de données.
Vous devez le remplir comme suit :
    ```
    "username": "Nom de L'utilisateur de la base de données MySQL",

    "password": "mot de passe de l'utilisateur de la base de données MySQL",

    "database": "groupomania",

    "host": "localhost"
    ```

## Back-End Setup
Dans votre terminal tapez :
```
cd backend
```
Ensuite 
```
npm install
```
Et pour lancer le backend : 
```
node server
```

## Front-End Setup
Assurez-vous d'abord d'avoir VueJS d'installer :
```
npm install -g @vue/cli
```
Ensuite : 
```
npm install
```
Et pour lancer le front :
```
npm run serve
```





