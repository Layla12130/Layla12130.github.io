document.addEventListener('DOMContentLoaded', () => {
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];

    let userInput = [];

    const activateEasterEgg = () => {
        // Toggle the 'hacker-mode' class on the body
        document.body.classList.toggle('konami-active');
        
        // You can add more effects here, like playing a sound
        console.log('Konami Code Activated!');
    };

    window.addEventListener('keydown', (event) => {
        userInput.push(event.key);

        // Keep the array at the same length as the konami code
        userInput = userInput.slice(-konamiCode.length);

        if (userInput.join('') === konamiCode.join('')) {
            activateEasterEgg();
        }
    });
});