<script>
export default {
    name: 'UserSettings',
    methods: {
        modifyProfil() {
            const lastName = document.getElementById('lastNameInput').value;
            const firstName = document.getElementById('firstNameInput').value;
            let confirm = window.confirm('Êtes-vous sûr de vouloir modifier votre compte ?')
            if(confirm) {
                let id = this.$route.query.id;
                fetch('http://localhost:3000/api/utilisateur/modify', {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({lastName, firstName, id})
                })
                .then(function() {
                    alert("Votre compte a bien été modifié !");
                    location.reload();
                })
                .catch(function(err) { 
                    console.log(err) 
                });
            }
        },
        deleteProfil() {
            let confirm = window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')
            if(confirm) {
                let userId = this.$route.query.id;
                fetch('http://localhost:3000/api/utilisateur/delete', {
                    method: "DELETE",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({userId})
                })
                .then(function() {
                    window.location.href = "http://localhost:8080";
                })
                .catch(function(err) { 
                    console.log(err) 
                });
            }
        }
    },
    beforeUpdate() {
        const token = localStorage.getItem('token');
        if(!token) {
            location.href = "http://localhost:8080"
        }
    },
    beforeCreate() {
        const token = localStorage.getItem('token');
        if(!token) {
            location.href = "http://localhost:8080"
        }
        let id = this.$route.query.id;
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
                    insertUser(picture.utilisateurEmail, picture.utilisateurPicture, picture.utilisateurFirstName, picture.utilisateurLastName);                }
            })
            .catch(function(err) { 
                console.log(err) 
            });

        function insertUser(email, picture, firstName, lastName) {
            const container = document.getElementById('picture');
            const img = document.createElement('img');
            img.setAttribute('src', picture);
            img.setAttribute('alt', 'Photo de profil de l\'utilisateur')
            container.appendChild(img);
            // Intègre l'email
            const emailDiv = document.getElementById('email');
            const emailSpan = document.createElement('span');
            emailSpan.innerText = email;
            emailDiv.appendChild(emailSpan)
            // Intègre le prénom
            const firstNameDiv = document.getElementById('firstName');
            const firstNameSpan = document.createElement('input');
            firstNameSpan.setAttribute('id', 'firstNameInput');
            firstNameSpan.setAttribute('placeholder', firstName);
            firstNameDiv.appendChild(firstNameSpan);
            // Intègre le nom
            const lastNameDiv = document.getElementById('lastName');
            const lastNameSpan = document.createElement('input');
            lastNameSpan.setAttribute('id', 'lastNameInput');
            lastNameSpan.setAttribute('placeholder', lastName);
            lastNameSpan.setAttribute('type', 'text');
            lastNameDiv.appendChild(lastNameSpan)
            // Met le bon lien pour la flèche retour
            const back = document.getElementById('back');
            back.setAttribute('href', "http://localhost:8080/social-network?id=" + id)
        }
    }
}
</script>





<template>
    <div class="body">
        <a id="back"><font-awesome-icon :icon="['fas', 'arrow-left-long']" class="body__back"/></a>

        <!-- =========== INFOS UTILISATEUR ========== -->
        <div class="body__settings">
            <div class="body__settings__picture" id="picture"></div>

            <div class="body__settings__info">
                <p id="lastName">Nom :</p>
                <p id="firstName">Prénom :</p>
                <p id="email">Email :</p>
            </div>

            <div class="body__settings__buttons">
                <button class="body__settings__buttons__modify" @click="modifyProfil">Modifier le profil</button>
                <button class="body__settings__buttons__delete" @click="deleteProfil">Supprimer le profil</button>
            </div>
        </div>

        <!-- =========== AMIS ========== -->
        <div class="body__friends">
            <h1 class="body__friends_title">AMIS</h1>
        </div>
    </div>
</template>







<style lang="scss">
    .body {
        display: flex;
        justify-content: space-evenly;
        margin-top: 100px;
            &__settings {
                background-color: #C7D0D8;
                border-radius: 15px;
                width: 30%;
                height: 750px;
                min-width: 445px;
                    &__picture {
                        overflow: hidden;
                        width: 200px;
                        height: 200px;
                        background-color: #FFF;
                        border-radius: 15px;
                        margin: auto;
                        margin-top: 50px;
                            &img {
                                width: 200px;
                                height: 200px;
                            }
                    }
                    &__info {
                        font-size: 20px;
                        text-align: left;
                        margin-left: 8%;
                        margin-top: 100px;
                            #lastName input {
                                font-size: 18px;
                                margin-left: 15px;
                            }
                            #firstName input {
                                font-size: 18px;
                                margin-left: 15px;
                            }
                    }
                    &__buttons {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                            &__modify {
                                background-color: grey;
                                border: none;
                                border-radius: 35px;
                                width: 50%;
                                height: 70px;
                                font-size: 28px;
                                margin-top: 50px;
                                margin-bottom: 30px;
                            }
                            &__delete {
                                background-color: red;
                                border: none;
                                border-radius: 35px;
                                width: 50%;
                                height: 70px;
                                font-size: 28px;
                                    &:hover {
                                        cursor: pointer;
                                        box-shadow: 2px 7px 10px 0px #8a8a8a;
                                        transition: .5s;
                                    }
                            }
                    }
            }
            &__friends {
                background-color: #C7D0D8;
                border-radius: 15px;
                width: 55%;
                height: 750px;
            }
            &__back {
                position: absolute;
                top: 30px;
                left: 60px;
                font-size: 40px;
                color: black;
            }
    }
    @media (max-width: 1120px) {
        .body {
            flex-direction: column;
                &__settings {
                    margin: auto;
                    margin-bottom: 50px;
                }
                &__friends {
                    margin: auto;
                    width: 70%;
                    margin-bottom: 75px;
                    min-width: 445px;
                }
        }
    }
</style>