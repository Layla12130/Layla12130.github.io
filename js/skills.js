import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

export function renderSkills(data) {
  const ctx = document.getElementById("skillsChart").getContext("2d");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: data.map(skill => skill.name),
      datasets: [{
        label: "技能熟练度",
        data: data.map(skill => skill.level),
        fill: true,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
      }]
    },
    options: {
      scales: {
        r: { min: 0, max: 100 }
      }
    }
  });
}

// 示例数据（改数据即可）
export const skillsData = [
  { name: "HTML", level: 80 },
  { name: "CSS", level: 70 },
  { name: "JavaScript", level: 60 },
  { name: "Vue", level: 50 },
  { name: "Python", level: 75 },
];

