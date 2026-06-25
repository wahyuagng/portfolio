const formatNumber = (value: number) => {
    const valueData = Math.ceil(value);
    return valueData?.toLocaleString('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

const formatPercentage = (value: number) => {
    const valueData = Math.ceil(value);
    return valueData?.toLocaleString('id-ID', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

const formatDate = (valueDate: any, format: any) => {
    const date = new Date(valueDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];

    const formattedDate = format
        .replace('dd', day)
        .replace('mm', month)
        .replace('yyyy', year)
        .replace('yy', String(year).slice(-2))
        .replace('MM', monthNames[date.getMonth()]);

    return formattedDate;
};

export { formatDate, formatNumber, formatPercentage };
