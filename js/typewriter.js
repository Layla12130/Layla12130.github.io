export function initTypewriter() {
  const textElement = document.getElementById("typewriter");
  const texts = [
    "你好，我是张艺桐",
    "一名前端开发爱好者",
    "未来的AI研究者",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const currentText = texts[textIndex];
    if (!deleting) {
      textElement.textContent = currentText.substring(0, charIndex++);
      if (charIndex > currentText.length) {
        deleting = true;
        setTimeout(type, 1000);
        return;
      }
    } else {
      textElement.textContent = currentText.substring(0, charIndex--);
      if (charIndex < 0) {
        deleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 50 : 100);
  }

  type();
}

