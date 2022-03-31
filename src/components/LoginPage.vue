<script>
export default {
	name: 'LoginPage',
    data: function() {
        return {
            mode: 'login',
            userEmail:'',
            userFirstName: '',
            userLastName: '',
            userPassword: '',
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
        submit() {
            const userData = {
                userEmail: this.userEmail,
                userLastName: this.userLastName,
                userFirstName: this.userFirstName,
                userPassword: this.userPassword
            };
            fetch('http://localhost:3000/api/utilisateur/signup', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({userData})
            })
            .then(function (res) { console.log(res) })
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
                    window.location.href = "http://localhost:8080/social-network"
                }
            })
            .catch((err) => console.log(err));
        }
    }
}
</script>

<template>
	<header class="header">
        <img class="header__img" src="../assets/icon-left-font-monochrome-black.png" alt="Logo de Groupomania"/>
        <a class="header__signup--login" href="#" @click="switchToSignUp" v-if="mode === 'login'">inscrivez-vous !</a>
        <a class="header__signup--signup" v-else>inscrivez-vous !</a>
    </header>

    <!-- Bloc Main qui sera utilisé pour la page de connexion -->
    <div class="main__login" v-if="mode === 'login'">
        <img class="main__login__img" src="../assets/icon.png" alt="logo groupomania"/>

        <div class="main__login__body">
            <div>
                <p class="main__login__body--text">Email</p>
                <input type="text" name="id" class="main__login__body--input" v-model="loginEmail">
            </div>

            <div>
                <p class="main__login__body--text">Mot de passe</p>
                <input type="text" name="password" class="main__login__body--input" v-model="loginPassword">
            </div>

            <button class="main__login__button" v-if="mode === 'login'" @click="login">se connecter</button>
        </div>
    </div>

    <!-- Bloc Main qui sera utilisé pour la page d'inscription -->
    <div class="main__signup" v-else>
        <img class="main__signup__img" src="../assets/icon.png" alt="logo groupomania"/>
        <p class="main__signup__login">Vous êtes déjà inscrit ? : <span><a class="main__signup__login--switch" href="#" @click="switchToLogin">Se connecter</a></span></p>

        <div class="main__signup__body">
            <div>
                <p class="main__signup__body__plus--text">Email</p>
                <input type="text" name="id" class="main__signup__body--input" v-model="userEmail">
            </div>

            <div class="main__signup__body__plus">
                <div>
                    <p class="main__signup__body__plus--text">Nom</p>
                    <input class="main__signup__body__plus--name" type="text" v-model="userLastName" v-if="mode === 'signup'">
                </div>

                <div>
                    <p class="main__signup__body__plus--text">Prénom</p>
                    <input class="main__signup__body__plus--name" type="text" v-model="userFirstName" v-if="mode === 'signup'">
                </div>
            </div>
   
            <div>
                <p class="main__signup__body__plus--text">Mot de passe</p>
                <input type="password" name="password" class="main__signup__body--input" v-model="userPassword">
            </div>
        </div>

        <button class="main__signup__button" v-if="mode === 'signup'" @click="submit">s'inscrire</button>
    </div>
</template>

<style lang="scss">
    body {
        background-color: #15AAD1;
    }

	.header {
        &__img {
            width: 700px;
            margin-top: -300px;
            margin-bottom: -220px;
        }
        &__signup {
            &--login {
                text-transform: uppercase;
                font-size: 30px;
                color: black;
                font-weight: bold;
                position: absolute;
                top: 90px;
                right: 120px;
            } 
            &--signup {
                display: none;
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
        &__body--text {
            font-size: 22px;
            text-align: left;
            margin-left: 8%;
            margin-bottom: 10px;
        }
        &__body--name {
            width: 35%;
            background-color: #C7D0D8;
            border: 6px solid #9AA7B2;
            border-radius: 15px;
            height: 50px;
            font-size: 22px;
            margin-right: 4%;
            margin-left: 4%;
        }
        &__body--input {
            width: 80%;
            background-color: #C7D0D8;
            border: 6px solid #9AA7B2;
            border-radius: 15px;
            height: 50px;
            font-size: 22px;
        }
        &__button {
            background-color: #15AAD1;
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
                background-color: #1576d1;
                box-shadow: 4px 4px 5px grey;
                transition: .5s;
            }
        }
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
            padding-top: 60px;
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
                &__plus {
                    display: flex;
                        &--text {
                            font-size: 22px;
                            text-align: left;
                            margin: 0;
                            margin-bottom: 10px;
                        }
                        &--name {
                            background-color: #C7D0D8;
                            border: 6px solid #9AA7B2;
                            border-radius: 15px;
                            height: 50px;
                            font-size: 22px;
                            margin-bottom: 50px;
                        }
                    }
                    &--input {
                        background-color: #C7D0D8;
                        border: 6px solid #9AA7B2;
                        border-radius: 15px;
                        height: 50px;
                        font-size: 22px;
                        margin-bottom: 50px;
                        width: 98%;
                    }
                }
                &__button {
                    background-color: #15AAD1;
                    width: 310px;
                    height: 100px;
                    border: none;
                    border-radius: 50px;
                    font-size: 30px;
                    font-weight: bold;
                    text-transform: uppercase;
                    position: absolute;
                    right: 8%;
                    top: 45%;
                    &:hover {
                        cursor: pointer;
                        background-color: #1576d1;
                        box-shadow: 4px 4px 5px grey;
                        transition: .5s;
                    }
        }
    }
</style>