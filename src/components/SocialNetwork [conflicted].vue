<script>
export default {
    name: 'SocialNetwork',
    data: function() {
        return {
            postTxt: '',
            id: '',
            postPicture: ''
        }
    },
    methods:{
        /* Fonction envoyant les infos d'un nouveau post au backend */
        sendPost() {
            // Récupère le texte entré dans le champ dédié
            const userId = this.id;
            const postTxt = this.postTxt;
            const postPic = this.postPicture;
            // Requête envoyant les infos au backend et récupérant le post crée
            fetch('http://localhost:3000/api/post/create', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId, postTxt, postPic})
            })
            .then(function (res) { console.log(res) })
            .catch(function(err) { console.log(err) });
        },
        /* Permet de récuperer l'image du post à envoyer au backend */
        picturePost() {
            let pictureName = document.getElementById('file').value;
            let filename = pictureName.split('\\');
            this.postPicture = filename[2];
        }      
    },
    beforeCreate() {
        /* Fonction récupérant les posts présent dans la BDD au chargement de la page */
        fetch('http://localhost:3000/api/post') 
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            // Affiche chacun des posts dans le DOM
            .then(function (value) {
                for(let post of value) {
                    postIntegration(post.postTxt, post.postImg, post.postUserPicture, post.postDate, post.postUserName);
                }
            })
            .catch(function(err) {
            console.log(err)
            });

        /* Fonction créant une carte pour chaque post */
        function postIntegration (text, postImage, userImage, date, name) {
            const postLocation = document.getElementById('mainPost');
            // Crée la div du post
            const postContainer = document.createElement('div');
            postContainer.classList.add('main__post__container');
            // Crée la div des infos du post
            const postInfo = document.createElement('div');
            postInfo.classList.add('main__post__container__info')
            postContainer.appendChild(postInfo);
            // Ajoute l'image de l'utilisateur qui as crée le post
            const picLocation = document.createElement('img');
            picLocation.classList.add('main__post__container__img');
            picLocation.setAttribute('src', userImage);
            postInfo.appendChild(picLocation);
            // Crée la div des infos user 
            const postUser = document.createElement('div');
            postUser.classList.add('main__post__container__info__user');
            postInfo.appendChild(postUser);
            /* // Crée l'icone pour gérer le post
            const postSettings = document.createElement('a');
            const icon = document.createElement('img');

            postSettings.appendChild(icon);
            postInfo.appendChild(postSettings); */
            // Ajoute la date du post
            const dateLocation = document.createElement('p');
            let dateDay = date.split('T');
            dateLocation.innerText = dateDay[0];
            postUser.appendChild(dateLocation);
            // Ajoute le nom de l'utilisateur 
            const nameLocation = document.createElement('p');
            nameLocation.classList.add('main__post__container__info__user__name');
            nameLocation.innerText = name;
            postUser.appendChild(nameLocation);
            // Ajoute le texte du post
            const postTextPart = document.createElement('p');
            postTextPart.classList.add('main__post__container__text')
            postTextPart.innerText = text;
            postContainer.appendChild(postTextPart);
            // Ajoute l'image du post
            const imgLocation = document.createElement('img');
            imgLocation.classList.add('main__post__container__')
            imgLocation.setAttribute('src', postImage);
            postContainer.appendChild(imgLocation);
            // Intègre le post au DOM
            postLocation.appendChild(postContainer);
        }
    },
    created() {
        /* Requête récupérant la photo de profil de l'utilsateur et l'intègre au DOM */
        let id = this.$route.query.id;
        this.id = id;
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
            .then(function (result) { 
                for(let picture of result) {
                    insertPicture(picture.utilisateurPicture);
                }
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
            container.appendChild(img);
            // Met le bon lien pour l'icone parametre
            const gear = document.getElementById('gear');
            gear.setAttribute('href', "http://localhost:8080/social-network/settings?id=" + id)
        }
    }
}
</script>

<template>
    <div class="header__social">
        <img src="../assets/icon.png" alt="logo de Groupomania" class="header__social__img">

        <div class="header__social__form">
            <input name="search" type="text" placeholder="Recherchez des posts ou des collègues..." class="header__social__form__input">
            <font-awesome-icon :icon="['fas', 'search']" class="header__social__form__search"/>
        </div>

        <div class="header__social__icon">
            <a id="gear"><font-awesome-icon :icon="['fas', 'gear']" class="header__social__icon__gear"/></a>
            <a href="http://localhost:8080/"><font-awesome-icon :icon="['fas', 'power-off']" class="header__social__icon__disconnect"/></a>
        </div>
    </div>

    <div class="main">
        <div class="main__post" id="mainPost">
            <div class="main__post__new">
                <div class="main__post__new__picture" id="profilePicture"></div>
                <input type="text" name="newPost" class="main__post__new__input" placeholder="Ajoutez un nouveau post..." v-model="postTxt">
                <button class="main__post__new__button" @click="sendPost" onclick="window.location.reload();">Publier votre post</button>
                <label for="file" class="main__post__new__label"><font-awesome-icon :icon="['fas', 'link']" /></label>
                <input type="file" accept="images/*" id="file" class="main__post__new__file" @change="picturePost">
            </div> 
            
            <!-- <div class="main__post__container">
                <div class="main__post__container__info">
                    <img>
                    <div class="main__post__container__info__user">
                        <p class="main__post__container__info__user__name></p> : date
                        <p></p> : nom
                    </div>
                    <a id="dot"><font-awesome-icon :icon="['fas', 'ellipsis']" class="main__post__container__info__dot"/></a>
                <div>
                <p class="main__post__container__text"></p> : texte du post
            </div> -->
        </div>

        <div class="main__friends">
            <h1 class="main__friends__title">AMIS</h1>

            <div class="main__friends__div">
                <div class="main__friends__div__box">
                    <div class="main__friends__div__box--photo"></div>
                </div>
                <div class="main__friends__div__box">
                    <div class="main__friends__div__box--photo"></div>
                </div>
                <div class="main__friends__div__box">
                    <div class="main__friends__div__box--photo"></div>
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
                    }
                    &__disconnect {
                        color: red;
                        font-size: 30px;
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
                                background-color: #1877F2;                               
                                color: white;
                                font-size: 16px;
                                font-weight: bold;
                                border: none;
                                border-radius: 10px;
                                height: 30px;
                                padding: 15px 15px 30px 15px;
                                position: absolute;
                                right: 40px;
                                padding-right: 40px;
                            }
                            &__label {
                                cursor: pointer;
                                color: #FFF;
                                font-weight: bold;
                                z-index: 1000;
                                position: absolute;
                                right: 52px;
                            }
                            &__file {
                                display: none;
                            }
                    }
                    &__container {
                        background-color: #FFF;
                        border-radius: 15px;
                        height: auto;
                        margin-bottom: 50px;
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
                                    &__user{
                                        display: flex;
                                        flex-direction: column-reverse;
                                        line-height: 0;
                                        margin-left: 15px;
                                            &__name {
                                                font-weight: bold;
                                            }
                                    }
                            }
                            &__text {
                                margin: auto;
                                margin-top: 30px;
                                padding-bottom: 40px;
                                width: 90%;
                            }
                    }
            }
            &__friends {
                background-color: #FFF;
                border-radius: 15px;
                width: 30%;
                max-height: 700px;
                    &__title {
                        color: black;
                        margin-top: 30px;
                    }
                    &__div {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        height: 600px;
                            &__box {
                                background-color: grey;
                                width: 90%;
                                height: 150px;
                                margin: auto;
                                border-radius: 15px;
                                position: relative;
                                    &--photo {
                                        background-color: #FFF;
                                        border-radius: 10px;
                                        width: 100px;
                                        height: 100px;
                                        position: absolute;
                                        top: 17%;
                                        left: 6%;
                                    }
                            }
                    }
            }
    }

    .test {
        width: 50px;
        height: 50px;
    }
</style>
 