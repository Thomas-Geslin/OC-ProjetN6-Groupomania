<script>
export default {
    name: 'SocialNetwork',
    data: function() {
        return {
            admin: '',
            id: '',
            postTxt: '',
            posts: null,
            users: null
        }
    },
    methods:{
        /* Fonction permettant la déconnexion de la session */
        disconnect() {
            localStorage.clear();
            location.href = "";
        },
        /* Fonction envoyant les infos d'un nouveau post au backend */
        sendPost() {
            // Ajoute un message d'alerte pour que l'utilisateur n'envoit pas de post par erreur
            let confirm = window.confirm('Voulez vous poster ceci ?')
            if(confirm) {
                const token = localStorage.getItem('token');
                // Récupère le texte entré dans le champ dédié
                const userId = this.id;
                const postTxt = this.postTxt;
                const postPic = this.postPicture;
                // Requête envoyant les infos au backend et récupérant le post crée
                fetch('http://localhost:3000/api/post/create', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({userId, postTxt, postPic})
                })
                .then(function (res) { console.log(res) })
                // On recharge la page une fois que le post as été ajouté 
                .then( location.reload() )
                .catch(function(err) { console.log(err) });
            }
        },
        /* Permet de récuperer l'image du post à envoyer au backend */
        picturePost() {
            let pictureName = document.getElementById('file').value;
            let filename = pictureName.split('\\');
            this.postPicture = filename[2];
            console.log(this.postPicture)
        },
        /* Permet de rechercher des posts en particulier suivant le contenu de leur texte */
        searchPost() {
            if(this.filter.length > 3) {
                fetch('http://localhost:3000/api/post/' + this.filter)
                    .then(res => res.json())
                    .then(response => this.posts = response)
                    .catch(err => console.log(err));
            } else {
                fetch('http://localhost:3000/api/post') 
                    .then(res => res.json())
                    .then(value => this.posts = value)
                    .catch(err => console.log(err));
            }
        },
        /* Affiche le menu pour modifier le post quand on clique sur les 3 petits points */
        postMenuAppear(id) {
            const menu = document.getElementById(id);
            const allMenu = document.getElementsByClassName('postMenu');

            for(let post of allMenu) {
                post.style.display = 'none'
            }

            if(menu.style.display === 'none') {
                menu.style.display = 'block';
            } else {
                menu.style.display = 'none';
            }
        },
        /* Permet de supprimer un post */
        deletePost(idPost) {
            const token = localStorage.getItem('token');
            const userId = this.id
            // Affiche une alerte pour être sûr que l'utilisateur ne supprime pas son post par erreur
            let confirm = window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')
            if(confirm) {
                const postId = idPost;
                fetch('http://localhost:3000/api/post/delete', {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({postId, userId})
                })
                .then( window.alert("Votre post as bien été supprimé !") )
                // On recharge la page une fois que le post as été supprimé
                .then( location.reload() )
                .catch(function(err) { 
                    console.log(err) 
                });
            }
        }
    },
    /* 2 blocs permettant d'empêcher la connexion ou la modification d'une page 
       si jamais l'utilisateur ne possède pas de token d'authentification */
    beforeCreate() {
        const token = localStorage.getItem('token');
        if(!token) {
            location.href = "http://localhost:8080"
        }
    },
    beforeUpdate() {
        const token = localStorage.getItem('token');
        if(!token) {
            location.href = "http://localhost:8080"
        }
    },
    created() {
        let id = this.$route.query.id;
        this.id = id;
        /* Fonction récupèrant les utilisateurs du réseau */
        fetch('http://localhost:3000/api/utilisateur')
            .then(res => res.json())
            .then(value => this.users = value)
            .catch(err => console.log(err));

        /* Fonction permettant de savoir si l'utilisateur a un compte admin ou non */
        fetch('http://localhost:3000/api/utilisateur/admin/' + this.id)
            .then(res => res.json())
            .then(value => this.admin = value[0].utilisateurIsAdmin)
            .catch(err => console.log(err));
            
        /* Fonction récupérant les posts présent dans la BDD au chargement de la page */
        fetch('http://localhost:3000/api/post') 
            .then(res => res.json())
            // Affiche chacun des posts dans le DOM
            .then(value => this.posts = value)
            .catch(err => console.log(err));
        
        /* Requête récupérant la photo de profil de l'utilsateur et l'intègre au DOM */
        fetch('http://localhost:3000/api/utilisateur', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
            })
            .then(function (res) { 
                return res.json(); 
            })
            .then(function(result) {
                insertPicture(result[0].utilisateurPicture)
            })
            .catch(function(err) { 
                console.log(err) 
            });

        function insertPicture(picture) {
            // Intègre la photo de profil de l'utilisateur au DOM
            const container = document.getElementById('profilePicture');
            let img = document.createElement('img');
            img.setAttribute('id', 'picture');
            img.setAttribute('src', picture);
            img.setAttribute('alt', 'Photo de Profil de l\'utilisateur')
            container.appendChild(img);
            // Met le bon lien pour l'icone parametre
            const gear = document.getElementById('gear');
            gear.setAttribute('href', "http://localhost:8080/social-network/settings?id=" + id)
        }
    }
}
</script>





<template>
    <!-- =========== HEADER ========== -->
    <div class="header__social">
        <img src="../assets/icon.png" alt="logo de Groupomania" class="header__social__img">
   
        <div class="header__social__form">
            <input name="search" type="text" @keyup="searchPost" v-model="filter" placeholder="Recherchez des posts ou des collègues..." class="header__social__form__input">
            <font-awesome-icon :icon="['fas', 'search']" class="header__social__form__search"/>
        </div>

        <div class="header__social__icon">
            <a id="gear"><font-awesome-icon :icon="['fas', 'gear']" class="header__social__icon__gear"/></a>
            <a @click="disconnect"><font-awesome-icon :icon="['fas', 'power-off']" class="header__social__icon__disconnect"/></a>
        </div>
    </div>

    <!-- =========== PARTIE PUBLICATIONS ========== -->
    <div class="main">
        <div class="main__post" id="mainPost">
            <div class="main__post__new">
                <div class="main__post__new__picture" id="profilePicture"></div>
                <input type="text" name="newPost" class="main__post__new__input" placeholder="Ajoutez un nouveau post..." v-model="postTxt">                
                <form method="POST" action="http://localhost:3000/api/post/create" enctype="multipart/form-data" target="target">
                    <label for="file" class="main__post__new__label"><font-awesome-icon :icon="['fas', 'link']"/></label>
                    <input type="file" accept="images/*" name="image" id="file" @change="picturePost" multiple>
                    <input type="submit" value="Publiez votre post" class="main__post__new__button" @click="sendPost">
                </form>
                <!-- Permet d'éviter que le form nous redirige vers une autre page quand il est submit -->
                <iframe name="target" style="display: none;"></iframe>
            </div> 
            
            <!-- === SQUELETTE POST === -->
            <div v-for="post in posts" :key="post" class="main__post__container">
                <div class="main__post__container__info">
                    <!-- Photo de profil -->
                    <img :src='post.postUserPicture' alt="Photo de profil de l'utilisateur qui as crée le post" class="main__post__container__img">
                    <!-- Infos du post -->
                    <div class="main__post__container__info__user">
                        <p>{{ post.postDate.split('T')[0] }}</p>
                        <p id="postId">{{ post.postId }}</p>
                        <p class="main__post__container__info__user__name">{{ post.postUserName }}</p>
                    </div>
                    <!-- Menu de modification -->
                    <font-awesome-icon :icon="['fas', 'ellipsis']" @click="postMenuAppear(post.postId)" v-if="this.id == post.postUserId" class="main__post__container__info__dot"/>
                    <font-awesome-icon :icon="['fas', 'ellipsis']" @click="postMenuAppear(post.postId)" v-if="this.admin === 'true'" class="main__post__container__info__dot"/>
                    <ul class="main__post__container__info__dot--menu postMenu" v-bind:id="post.postId">
                        <div class="main__post__container__info__dot--arrow"></div>
                        <li>Modifier</li>
                        <li @click="deletePost(post.postId)">Supprimer</li>
                    </ul>
                </div>
                <!-- Texte du post -->
                <p class="main__post__container__text">{{ post.postTxt }}</p>
                <!-- Image du post -->
                <img :src='post.postImg' alt="Photo ajoutée au post" class="main__post__container__postImage" v-if="post.postImg">
            </div>
        </div>

        <!-- =========== PARTIE UTILISATEURS ========== -->
        <div class="main__friends">
            <h1 class="main__friends__title">UTILISATEURS</h1>

            <div v-for="user in users" :key="user" class="main__friends__div">
                <div class="main__friends__div__box">
                    <img :src='user.utilisateurPicture' alt="Photo de profil de l'utilisateur" class="main__friends__div__box__photo">
                    <p class="main__friends__div__box__last">Nom : {{ user.utilisateurLastName }}</p>
                    <p class="main__friends__div__box__first">Prénom : {{ user.utilisateurFirstName }}</p>
                </div>
            </div>
        </div>
    </div>
</template>





<style lang="scss">
    body {
        background-color: #F2F5F7;
        margin: 0;
        padding: 0;
    }

    .header__social {
        background-color: #FFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
            &__img {
               width: 85px;
               margin-left: 50px;
            }
            &__form {
                width: 50%;
                position: relative;
                    &__input {
                        width: 100%;
                        height: 40px;
                        background-color: #F2F5F7;
                        border: none;
                        border-radius: 30px;
                        font-size: 20px;
                        padding-left: 25px;
                    }
                    &__search {
                        font-size: 20px;
                        position: absolute;
                        right: 0;
                        top: 12px;
                    }
            }
            &__icon {
                margin-right: 150px;
                    &__gear {
                        color: black;
                        font-size: 30px;
                        margin-right: 60px;
                            &:hover {
                                cursor: pointer;
                            }
                    }
                    #gear {
                        cursor: default;
                    }
                    &__disconnect {
                        color: red;
                        font-size: 30px;
                            &:hover {
                                cursor: pointer;
                            }
                    }
            }
    }

    .main {
        display: flex;
        justify-content: space-evenly;
        margin-top: 50px;
            &__post {
                border-radius: 15px;
                width: 55%;
                    &__new {   
                        display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                        position: relative;
                        background-color: #FFF;
                        border-radius: 15px;
                        margin-bottom: 100px;
                            &__picture {
                                width: 100px;
                                height: 100px;
                                border-radius: 15px;
                                background-color: #F2F5F7;
                                overflow: hidden;
                                    & img {
                                        width: 100px;
                                    }
                            }
                            &__input {
                                background-color: #F2F5F7;
                                border: none;
                                border-radius: 15px;
                                width: 80%;
                                height: 100px;
                                font-size: 30px;
                                padding-left: 30px;
                                margin-top: 15px;
                                margin-bottom: 15px;
                            }
                            &__button {
                                background-color: #b64a51;                               
                                color: white;
                                font-size: 16px;
                                font-weight: bold;
                                border: none;
                                border-radius: 10px;
                                height: 30px;
                                padding: 15px 15px 30px 15px;
                                position: absolute;
                                right: 50px;
                                bottom: 42px;
                                padding-right: 40px;
                                    &:hover {
                                        box-shadow: 2px 7px 10px 0px #8a8a8a;
                                        transition: .5s;
                                    }
                            }
                            &__label {
                                cursor: pointer;
                                color: #FFF;
                                font-weight: bold;
                                z-index: 1000;
                                position: absolute;
                                right: 57px;
                                bottom: 54px;
                            }
                            input[type="file"] {
                                display: none;
                            }
                    }
                    &__container {
                        background-color: #FFF;
                        border-radius: 15px;
                        height: auto;
                        margin-bottom: 50px;
                        position: relative;
                            &__img {
                                width: 65px;
                                height: 65px;
                                border-radius: 15px;
                                outline: black 1px solid;
                                margin-top: 30px;
                                margin-left: 30px;
                            }
                            &__info {
                                display: flex;
                                    #postId {
                                        display: none;
                                    }
                                    &__user{
                                        display: flex;
                                        flex-direction: column-reverse;
                                        line-height: 0;
                                        margin-left: 15px;
                                        text-align: left;
                                            &__name {
                                                font-weight: bold;
                                            }
                                    }
                                    &__dot {
                                        font-size: 30px;
                                        position: absolute;
                                        right: 40px;
                                        top: 25px;
                                            &:hover {
                                                cursor: pointer;
                                            }
                                            &--menu {
                                                display: none;
                                                list-style: none;
                                                background-color: #bdbdbd;
                                                border-radius: 10px;
                                                padding: 0;
                                                margin: 0;
                                                height: 58px;
                                                position: absolute;
                                                top: 60px;
                                                right: 8px;
                                                    & li {
                                                        padding: 5px 10px;
                                                        border-radius: 10px;
                                                            &:hover {
                                                                cursor: pointer;
                                                                background-color: #a1a1a1;
                                                                transition: .5s;
                                                            }
                                                    }
                                            }
                                            &--arrow {
                                                width: 0;
                                                height: 0;
                                                border-style: solid;
                                                border-width: 0 7.5px 10px 7.5px;
                                                border-color: transparent transparent #bdbdbd transparent;
                                                position: absolute;
                                                right: 38px;
                                                top: -10px;
                                            }
                                    }
                            }
                            &__text {
                                margin: auto;
                                margin-top: 30px;
                                padding-bottom: 40px;
                                width: 90%;
                            }
                            &__postImage {
                                margin-bottom: 40px;
                                border-radius: 15px;
                                width: auto;
                                outline: 1px solid black;
                            }
                    }
                    &__ellipsis {
                        width: 2%;
                    }
            }
            &__friends {
                background-color: #FFF;
                border-radius: 15px;
                width: 30%;
                max-height: 700px;
                min-width: 390px;
                    &__title {
                        color: black;
                        margin-top: 30px;
                        margin-bottom: 20px;
                    }
                    &__div {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        height: auto;
                            &__box {
                                font-size: 18px;
                                background-color: #F2F5F7;
                                width: 90%;
                                height: 150px;
                                margin: auto;
                                margin-bottom: 50px;      
                                border-radius: 15px;
                                position: relative;
                                    &__photo {
                                        background-color: #FFF;
                                        border-radius: 10px;
                                        width: 100px;
                                        height: 100px;
                                        position: absolute;
                                        top: 17%;
                                        left: 6%;
                                    }
                                    &__last {
                                        display: flex;
                                        padding-left: 160px;
                                        margin: 0;
                                        margin-top: 45px;
                                    }
                                    &__first {
                                        display: flex;
                                        padding-left: 160px;
                                            &--first {
                                                padding-right: 7px;
                                            }
                                    }
                            }
                    }
            }
    }

    @media (min-width: 1121px) and (max-width: 1500px) {
        .main__post {
            &__new {
                margin-bottom: 70px;
                    &__picture {
                        width: 60px;
                        height: 60px;
                            & img {
                                width: 60px;
                            }
                    }
                    &__input {
                        height: 60px;
                        font-size: 22px;
                        padding-left: 20px;
                    }
                    &__label {
                        font-size: 14px;
                        right: 60px;
                        bottom: 38px;
                    }
                    &__button {
                        font-size: 13px;
                        right: 50px;
                        bottom: 25px;
                    }
            }
        }
    }
    @media (max-width: 1250px) {
        .header__social {
            &__icon {
                margin-right: 50px;
                min-width: 120px ; 
            }
        }
    }
    @media (max-width: 1120px) {
        .main {
            &__friends {
                display: none;
            }
            &__post {
                width: 80%;
                    &__new {
                        margin-bottom: 80px;
                    &__picture {
                        width: 80px;
                        height: 80px;
                            & img {
                                width: 80px;
                            }
                    }
                    &__input {
                        height: 80px;
                        font-size: 22px;
                        padding-left: 20px;
                    }
                    &__label {
                        font-size: 14px;
                        right: 57px;
                        bottom: 48px;
                    }
                    &__button {
                        font-size: 13px;
                        right: 45px;
                        bottom: 35px;
                    }
                }
            }
        }
    }
    @media (max-width: 850px) {
        .header__social {
            &__form {
                &__input {
                    display: none;
                }
                &__search {
                    display: none;
                }
            }
        }
    }
    @media (max-width:768px) {
        .main__post {
            &__new {
                margin-bottom: 50px;
                    &__picture {
                        width: 50px;
                        height: 50px;
                            & img {
                                width: 50px;
                            }
                    }
                    &__input {
                        height: 50px;
                        font-size: 16px;
                        padding-left: 15px;
                    }
                    &__label {
                        font-size: 12px;
                        right: 42px;
                        bottom: 33px;
                    }
                    &__button {
                        font-size: 11px;
                        right: 35px;
                        bottom: 27px;
                        padding: 10px 30px 20px 10px;
                    }
            }
        }
    }
</style>
 