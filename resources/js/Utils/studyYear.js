import dayjs from "dayjs";

const studyYear = () => {
    const now = dayjs();

    return now.month() < 6 ? `${now.year()-1}/${now.year()}` : `${now.year()}/${now.year()+1}`;
}

export default studyYear;