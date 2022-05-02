<script>
export default {
	name: 'LoginPage',
    data: function() {
        return {
            mode: 'signup',
            userEmail:'',
            userFirstName: '',
            userLastName: '',
            userPassword: '',
            userPicture: 'pdp_default.png',
            loginEmail: '',
            loginPassword: ''
        }
    },
    methods: {
        switchToSignUp: function() {
            this.mode = 'signup';
        },
        switchToLogin: function() {
            this.mode = 'login';
        },
        /* Permet d'avoir un aperçu de la photo de profil avant de l'envoyer */
        previewPic() {
            // Intègre une preview de l'image au DOM
            const container = document.getElementById('pictureContainer')
            const image = document.createElement('img');
            container.appendChild(image);
            image.setAttribute('src', URL.createObjectURL(event.target.files[0]));
            image.classList.add('main__signup__body__picture__preview');
            // Permet d'envoyer le nom du fichier au backend avec sendData()
            let pictureName = document.getElementById('upload').value;
            let filename = pictureName.split('\\');
            this.userPicture = filename[2];
            console.log(this.userPicture)
        },
        signup() {
            const userData = {
                userEmail: this.userEmail,
                userLastName: this.userLastName,
                userFirstName: this.userFirstName,
                userPassword: this.userPassword,
                userPicture: this.userPicture
            };
            fetch('http://localhost:3000/api/utilisateur/signup', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({userData})
            })
            .then(function () { 
                window.alert('Vous vous êtes bien inscrit !');
                window.location.reload();
            })
            .catch(function(err) { console.log(err) });
        },
        login() {
            const loginData = {
                loginEmail: this.loginEmail,
                loginPassword: this.loginPassword
            };
            fetch('http://localhost:3000/api/utilisateur/login', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({loginData})
            })
            .then(function(res) {
                if(res.ok) {
                   return res.json();
                }
            })
            .then(function(value) {
                localStorage.setItem('token', value.token);
                let id = value.userId;
                window.location.href = "http://localhost:8080/social-network?id=" + id;
            })
            .catch((err) => console.log(err));
        },
        mailVerification () {
            const email = this.userEmail;
            const errorBloc = document.getElementById('emailErr');
            if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                errorBloc.innerText = '';
            } else {
                errorBloc.innerText = 'Veuillez rentrer une adresse mail valide !';
            }
        },
        firstNameVerification () {
            const firstName = this.userFirstName;
            const errorBloc = document.getElementById('firstNameErr');
            if (/^[a-zA-ZÀ-ž]+([a-zA-ZÀ-ž\s-',])+$/.test(firstName)) {
                errorBloc.innerText = '';
            } else {
                errorBloc.innerText = 'Veuillez rentrer uniquement des lettres !';
            }
        },
        lastNameVerification () {
            const lastName = this.userLastName;
            const errorBloc = document.getElementById('lastNameErr');
            if (/^[a-zA-ZÀ-ž]+([a-zA-ZÀ-ž\s-',])+$/.test(lastName)) {
                errorBloc.innerText = '';
            } else {
                errorBloc.innerText = 'Veuillez rentrer uniquement des lettres !';
            }
        },
        /* Permet de vérifier les champs du formulaire d'inscription avant de l'envoyer */
        formVerification() {
            const firstName = this.userFirstName;
            const lastName = this.userLastName;
            const button = document.getElementById('signup');
            if(/^[a-zA-ZÀ-ž]+([a-zA-ZÀ-ž\s-',])+$/.test(firstName, lastName)) {
                button.removeAttribute('disabled');
            } else {
                button.setAttribute('disabled', true);
            }
        }
    }
}
</script>






<template>
    <!-- =========== HEADER ========== -->
	<header class="header">
        <img class="header__img" src="../assets/icon-left-font-monochrome-black-reduct.png" alt="Logo de Groupomania"/>
        <a class="header__signup--login" href="#" @click="switchToSignUp" v-if="mode === 'login'">inscrivez-vous !</a>
        <a class="header__signup--signup" v-else>inscrivez-vous !</a>
    </header>

    <!-- =========== MAIN LOGIN ========== -->
    <div class="main__login" v-if="mode === 'login'">
        <img class="main__login__img" src="../assets/icon.png" alt="logo groupomania"/>

        <div class="main__login__body">
            <div class="main__login__body__div">
                <label for="email" class="main__login__body__label">Email</label>
                <input type="text" name="id" class="main__login__body__input" id="email" v-model="loginEmail">
            </div>

            <div class="main__login__body__div">
                <label for="prenom" class="main__login__body__label">Prénom</label>
                <input type="password" name="password" class="main__login__body__input" id="prenom" v-model="loginPassword">
            </div>

            <button class="main__login__button" v-if="mode === 'login'" @click="login">se connecter</button>
        </div>
    </div>

    <!-- =========== MAIN SIGNUP ========== -->
    <div class="main__signup" v-else>
        <img class="main__signup__img" src="../assets/icon.png" alt="logo groupomania"/>
        <p class="main__signup__login">Vous êtes déjà inscrit ? : <span><a class="main__signup__login--switch" href="#" @click="switchToLogin">Se connecter</a></span></p>

        <div class="main__signup__body">
            <div>
                <label for="Email" class="main__signup__body__text">Email</label>
                <input type="text" name="id" class="main__signup__body__input" id="Email" v-model="userEmail" @change="mailVerification">
                <p id="emailErr" class="main__signup__body__error"></p>
            </div>
            
            <div>
                <div class="main__signup__body__adapt">
                    <label for="LastName" class="main__signup__body__text">Nom</label>
                    <input class="main__signup__body__name main__signup__body__name--last" id="LastName" type="text" v-model="userLastName" v-if="mode === 'signup'" @change="lastNameVerification">
                    <p id="lastNameErr" class="main__signup__body__error"></p>
                </div>

                <div class="main__signup__body__adapt">
                    <label for="FirstName" class="main__signup__body__text">Prénom</label>
                    <input class="main__signup__body__name" type="text" id="FirstName" v-model="userFirstName" v-if="mode === 'signup'" @change="firstNameVerification">
                    <p id="firstNameErr" class="main__signup__body__error"></p>
                </div>
            </div>
   
            <div class="main__signup__body__mdp">
                <label for="Password" class="main__signup__body__text">Mot de passe</label>
                <input type="password" name="password" class="main__signup__body__input" id="Password" v-model="userPassword" @change="formVerification">
            </div>

            <form method="POST" action="http://localhost:3000/api/utilisateur/signup" enctype="multipart/form-data" target="target" id="pictureContainer">
                <label for="upload" class="main__signup__body__picture__label"><font-awesome-icon :icon="['fas', 'user']" class="main__signup__body__picture__label__icon"/><br>Choississez votre photo de profil</label>
                <input type="file" accept="image/*" name="image" @change="previewPic" class="main__signup__body__picture__upload" id="upload">
                <input type="submit" id="signup" value="S'INSCRIRE" v-if="mode === 'signup'" @click="signup" class="main__signup__button">
            </form>
            <!-- Permet d'éviter que le form nous redirige vers une autre page quand il est submit -->
            <iframe name="target" style="display: none;"></iframe>
        </div>
    </div>
</template>





<style lang="scss">
    body {
        background-color: #d1515a;
        margin: 0;
        padding: 0;
    }

	.header {
        &__img {
            width: 50%;
            text-align: center;
        }
        &__signup {
            &--login {
                text-transform: uppercase;
                font-size: 30px;
                color: black;
                font-weight: bold;
                position: absolute;
                right: 50px;
                top: 105px;
            } 
            &--signup {
                display: none;
            }  
        }
    }
    @media (max-width: 1230px) {
        .header {
            display: flex;
            flex-direction: column;
                &__img{
                    width: 550px;
                    margin: auto;
                }
                &__signup--login {
                    position: static;
                    width: 380px;
                    margin: auto;
                    margin-top: 30px;
                    margin-bottom: 50px;
                }
        }
        .main__login {
                &__button {
                    margin-bottom: 150px;
                    min-width: 245px;
                }
        }
    }
    @media (max-width: 600px) {
        .header {
            display: flex;
            flex-direction: column;
                &__img{
                    width: 400px;
                    margin: auto;
                    margin-top: 30px;
                }
                &__signup--login {
                    position: static;
                    width: 50%;
                    margin: auto;
                    margin-top: 30px;
                    margin-bottom: 50px;
                }
        }
        .main__login {
            max-width: 90%;
        }
    }
    @media (max-width: 420px) {
        .header {
            display: flex;
            flex-direction: column;
                &__img {
                    width: 300px;

                }
        }
    }

    /* Style appliqués à la page de connexion */
    .main__login {
        background-color: #FFF;
        width: 500px;
        height: 600px;
        margin: auto;
        border-radius: 35px;
        &__img {
            width: 100px;
            margin-top: 25px;
        }
        &__body {
            &__div {
                display: flex;
                flex-direction: column;
                margin-left: 10%;
            }
            &__label {
                text-align: left;
                font-size: 22px;
                margin-bottom: 10px;
            }
            &__input {
                width: 80%;
                background-color: #C7D0D8;
                border: 6px solid #9AA7B2;
                border-radius: 15px;
                height: 50px;
                font-size: 22px;
                margin-bottom: 30px;
            }
        }
        &__button {
            background-color: #d1515a;
            margin-top: 10%;
            width: 60%;
            height: 100px;
            border: none;
            border-radius: 50px;
            font-size: 30px;
            font-weight: bold;
            text-transform: uppercase;
            &:hover {
                cursor: pointer;
                background-color: #af3e46;
                box-shadow: 4px 4px 5px grey;
                transition: .5s;
            }
        }
    }
    @media (max-width: 1375px) {

    }

    /* Style appliqués à la page d'inscription */
    .main__signup {
        background-color: #FFF;
        width: 65%;
        height: 600px;
        margin: auto;
        border-radius: 35px;
        position: relative;
            &__img {
                margin: 0;
                width: 100px;
                padding: 30px;
                float: left;
            }
            &__login {
                font-size: 24px;
                padding-top: 40px;
                padding-right: 30px;
                text-align: right;
                    &--switch {
                        color: blue;
                    }
            }
            &__body {
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
                width: 45%;
                text-align: left;
                margin-top: -50px;
                position: relative;
                    &__text {
                        font-size: 22px;
                        text-align: left;
                        margin: 0;
                        margin-bottom: 10px;
                    }
                    &__adapt {
                        display: flex;
                        flex-direction: column;
                    }
                    &__name {
                        background-color: #C7D0D8;
                        border: 6px solid #9AA7B2;
                        border-radius: 15px;
                        height: 50px;
                        font-size: 22px;
                        margin-bottom: 30px;
                        width: 50%;
                    }
                    &__error {
                        color: red;
                        position: relative;
                        top: -25px;
                        margin: 0;
                    }
                    &__input {
                        background-color: #C7D0D8;
                        border: 6px solid #9AA7B2;
                        border-radius: 15px;
                        height: 50px;
                        font-size: 22px;
                        margin-top: 10px;
                        margin-bottom: 30px;
                        width: 98%;
                    }
                    &__picture {
                        border-radius: 15px;
                            &__label {
                                text-align: center;
                                background-color: #C7D0D8;
                                border: 6px solid #9AA7B2;
                                border-radius: 15px;
                                width: 170px;
                                height: 170px;
                                position: absolute;
                                top: 175px;
                                right: 15px;
                                    &__icon {
                                        font-size: 25px;
                                        padding-top: 40px;
                                        padding-bottom: 10px;
                                    }
                            }
                            &__preview {
                                background-color: #C7D0D8;
                                border: 6px solid #9AA7B2;
                                border-radius: 15px;
                                width: 170px;
                                height: 170px;
                                border-radius: 10px;
                                position: absolute;
                                top: 175px;
                                right: 15px;
                            } 
                            input[type="file"] {
                                display: none;
                            }                       
                    }
            }
            &__button {
                background-color: #d1515a;
                width: 310px;
                height: 100px;
                border: none;
                border-radius: 50px;
                font-size: 30px;
                font-weight: bold;
                text-transform: uppercase;
                position: absolute;
                right: -80%;
                top: 43%;
                    &:hover {
                        cursor: pointer;
                        background-color: #af3e46;
                        box-shadow: 4px 4px 5px grey;
                        transition: .5s;
                    }
            }
            input[type="file"] {
                display: none;
            }
    }
    @media (max-width: 1600px) {
        .main__signup {
            &__body {
                &__input {
                    margin-bottom: 15px;
                }
                &__adapt {
                    display: flex;
                }
                &__name {
                    width: 80%;
                    margin-bottom: 150px;
                }
                &__picture {
                    &__label {
                        top: 130px;
                        right: -250px;
                    }
                    &__preview {
                        top: 136px;
                        right: -244px;
                    }
                }
                &__mdp {
                    margin-top: -120px;
                }
            }
            &__button {
                top: 400px;
                right: 0;
            }
        }   
    }
    @media (max-width: 1200px) {
        .main__signup {
            height: 900px;  
            margin-bottom: 100px; 
                &__body {
                    margin-top: 30px;
                        &__input {
                            width: 90%;
                        }
                        &__picture {
                            &__label {
                                right: 10%;
                                top: 400px;
                            }
                            &__preview {
                                right: 12%;
                                top: 406px;
                            }
                        }
                        &__adapt {
                            width: 150%;
                        }
                } 
                &__button {
                    top: 650px;
                    right: -25px;
                }
        }   
    }
    @media (max-width: 1110px) {
        .main__signup {
            &__button {
                right: -20px;
            }
        }   
    }
    @media (max-width: 1060px) {
        .main__signup {
            &__button {
                right: -15px;
            }
        }   
    }
    @media (max-width: 985px) {
        .main__signup {
            &__button {
                right: -10px;
            }
        }   
    }
    @media (max-width: 950px) {
        .main__signup {
            height: 1000px;
                &__img {
                    float: none;
                }
                &__login {
                    padding: 0;
                    margin-top: 0;
                    text-align: center;
                }
                &__body {
                    margin: auto;
                    width: 90%;
                        &__input {
                            width: 62%;
                        }
                        &__name {
                            width: 70%;
                        }
                        &__picture {
                                &__label {
                                    right: 35%;
                                    top: 400px;
                                }
                                &__preview {
                                    top: 406px;
                                    right: 36.5%;
                                }
                            }
                }
                &__button {
                    right: 100px;
                    top: 650px;
                }
        }   
    }
    @media (max-width: 900px) {
        .main__signup {
            &__button {
                right: 85px;
            }
        }   
    }
    @media (max-width: 850px) {
        .main__signup {
            &__button {
                right: 70px;
            }
        }   
    }
    @media (max-width: 800px) {
        .main__signup {
            &__button {
                right: 60px;
            }
        }   
    }
    @media (max-width: 750px) {
        .main__signup {
            &__button {
                right: 50px;
            }
        }   
    }

    @media (max-width: 700px) {
        .main__signup {
            &__button {
                right: 40px;
            }
        }   
    }
    @media (max-width: 650px) {
        .main__signup {
            &__button {
                right: 25px;
            }
        }   
    }
    @media (max-width: 425px) {
        .main__signup {
            height: 1100px;
            &__body {
                &__name {
                    width: 62%;
                        &--last {
                            margin-bottom: 20px;
                        }
                }
                &__adapt {
                    display: flex;
                    flex-direction: column;
                }
                &__picture {
                        &__label {
                            top: 500px;
                            right: 30px;
                        }
                        &__preview {
                            top: 500px;
                            right: 30px;
                        } 
                }
            }
            &__button {
                width: 210px;
                font-size: 20px;
                top: 720px;
                right: 15px;
            }
        }   
    }
</style>