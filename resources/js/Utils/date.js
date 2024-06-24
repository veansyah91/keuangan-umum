const now = () => {
    let dateNow = new Date();
    let tahun = dateNow.getFullYear();
    let bulan = dateNow.getMonth() + 1; // Ingat, bulan dimulai dari 0
    let tanggal = dateNow.getDate();

    return `${tahun}-${bulan}-${tanggal}`;
};

export { now };
