self.onmessage = function(event) {
    const data = event.data;
    const CHUNK_SIZE = 100; // Increase chunk size for faster processing
    let currentIndex = 0;
    const pointsSet = new Set();
    const arcsData = [];
    const labelsData = [];

    while (currentIndex < data.length) {
        const chunk = data.slice(currentIndex, currentIndex + CHUNK_SIZE);
        currentIndex += CHUNK_SIZE;

        chunk.forEach(attack => {
            const fromKey = `${attack.from.lat},${attack.from.lng}`;
            const toKey = `${attack.to.lat},${attack.to.lng}`;
            if (!pointsSet.has(fromKey)) {
                pointsSet.add(fromKey);
                labelsData.push({ lat: attack.from.lat, lng: attack.from.lng, label: attack.from.label });
            }
            if (!pointsSet.has(toKey)) {
                pointsSet.add(toKey);
                labelsData.push({ lat: attack.to.lat, lng: attack.to.lng, label: attack.to.label });
            }
            arcsData.push({
                startLat: attack.from.lat,
                startLng: attack.from.lng,
                endLat: attack.to.lat,
                endLng: attack.to.lng
            });
        });

        // Log processed chunk for debugging
        console.log(`Processed chunk: `, chunk);

        // Post a message back to the main thread with the processed data
        self.postMessage({
            pointsData: Array.from(pointsSet).map(key => {
                const [lat, lng] = key.split(',').map(Number);
                return { lat, lng };
            }),
            arcsData,
            labelsData,
            currentIndex
        });
    }

    self.close();
};
