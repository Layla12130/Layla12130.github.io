export function renderTimeline(data) {
  const container = document.getElementById("timeline");
  container.innerHTML = "";
  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `<h3>${item.year}</h3><p>${item.event}</p>`;
    container.appendChild(div);
  });
}

// 示例数据（改数据即可）
export const timelineData = [
  { year: "2020", event: "进入大学，开始学习计算机" },
  { year: "2022", event: "参与科研项目，探索AI应用" },
  { year: "2025", event: "个人主页正式上线 🚀" },
];

