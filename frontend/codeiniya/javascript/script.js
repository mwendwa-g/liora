document.addEventListener('DOMContentLoaded',()=>{
    //ACOOUNT SHOW OR HIDE
    const accountform = document.querySelector('.iniya-account-form');
    const useraccountclose = document.querySelector('.iniya-account-form .user-account-close');
    const menuaccountshow = document.getElementById('menu-item-account')
    const menuwrapper = document.getElementById('menu-wrapper')
    useraccountclose.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        accountform.classList.add('active');
        menuwrapper.classList.remove("blur-background");
    })
    menuaccountshow.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        accountform.classList.remove('active');
        menuwrapper.classList.add("blur-background");
    })

    //ACCOUNT SIGIN AND SIGNUP SWITCH
    const flipCard = document.querySelector(".flip-card");
    const showLoginBtn = document.getElementById("account-signin-bt");
    const showSignupBtn = document.getElementById("account-signup-bt");
    showLoginBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        flipCard.classList.add("flipped");
    });
    showSignupBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        flipCard.classList.remove("flipped");
    });

    //CURRENT YEAR
    const currentYear = new Date().getFullYear();
    document.getElementById("our-current-year").textContent = currentYear;
})