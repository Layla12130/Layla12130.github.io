document.addEventListener('DOMContentLoaded', function() {
    const mapContainer = document.getElementById('travel-map');

    if (mapContainer) {
        // 设置地图中心和缩放级别
        const mapCenter = [34.0, 108.9];
        const map = L.map('travel-map', {
            zoomControl: true,
            scrollWheelZoom: false,
            attributionControl: false
        }).setView(mapCenter, 4);

        // 添加自定义样式的瓦片图层
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        // 丰富的足迹数据
        const places = [
            { name: '北京', coords: [39.9042, 116.4074], desc: '首都，科技与文化中心', icon: '🏙️' },
            { name: '上海', coords: [31.2304, 121.4737], desc: '国际大都市，金融中心', icon: '🌆' },
            { name: '成都', coords: [30.5728, 104.0668], desc: '美食之都，休闲生活', icon: '🐼' },
            { name: '深圳', coords: [22.5431, 114.0579], desc: '创新之城，创业热土', icon: '🚀' },
            { name: '西安', coords: [34.3416, 108.9402], desc: '历史古都，文化底蕴', icon: '🏯' }
        ];

        // 自定义 marker 图标样式
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<span style="font-size:1.6em;">📍</span>',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        // 添加足迹点和弹窗
        places.forEach(place => {
            L.marker(place.coords, { icon: customIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width:120px;">
                        <div style="font-size:1.5em;">${place.icon} <b>${place.name}</b></div>
                        <div style="margin-top:6px;color:#4e8cff;">${place.desc}</div>
                    </div>
                `);
        });

        // 地图美化样式
        const style = document.createElement('style');
        style.innerHTML = `
            #travel-map { border-radius: 14px; box-shadow: 0 4px 24px rgba(78,140,255,0.13); }
            .custom-marker span { filter: drop-shadow(0 2px 6px rgba(78,140,255,0.18)); }
            .leaflet-popup-content { font-family: 'Inter', 'Arial', sans-serif; font-size: 1em; }
            .leaflet-popup-content-wrapper { border-radius: 10px; box-shadow: 0 2px 12px rgba(78,140,255,0.10); }
        `;
        document.head.appendChild(style);

    } else {
        console.error('Travel map container not found!');
    }
});