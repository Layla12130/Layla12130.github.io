// 日夜模式切换
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark") ? "🌙" : "☀️";
});

// 动态打字机
const texts = [
  "你好，我是 Zhang Yitong",
  "AI × 医疗 开发者",
  "专注 药物协同预测 与 边缘计算",
  "Slytherin · INTJ · 无限可能"
];
let count = 0, index = 0, currentText = "", letter = "";
function type() {
  if (count === texts.length) count = 0;
  currentText = texts[count];
  letter = currentText.slice(0, ++index);

  document.getElementById("typewriter").textContent = letter;
  if (letter.length === currentText.length) {
    setTimeout(() => {
      index = 0;
      count++;
      type();
    }, 1500);
  } else {
    setTimeout(type, 100);
  }
}
type();

// 技能条 Intersection Observer
const skills = document.querySelectorAll(".progress");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const percent = entry.target.getAttribute("data-percent");
      entry.target.style.width = percent + "%";
    }
  });
}, { threshold: 0.5 });
skills.forEach(skill => observer.observe(skill));

// 雷达图
const ctx = document.getElementById("skillsChart");
new Chart(ctx, {
  type: "radar",
  data: {
    labels: ["科研", "开发", "创新", "协作", "审美"],
    datasets: [{
      label: "技能分布",
      data: [85, 80, 88, 70, 75],
      backgroundColor: "rgba(76,175,80,0.2)",
      borderColor: "#4caf50"
    }]
  },
  options: { responsive: true }
});
