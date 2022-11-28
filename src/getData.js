import Notifix from 'notiflix';
import axios from 'axios';

const getData = async params => {
  const url = 'https://pixabay.com/api/';
  const key = '27364037-494c2c1537a13aa746fb2bd48';
  const image_type = 'photo';
  const orientation = 'horizontal';
  const safesearch = true;
  console.log(params);
  try {
    const data = await axios.get(url, {
      params: { key, image_type, orientation, safesearch, ...params },
    });
    return data;
  } catch (error) {
    console.error(error.message);
  }
};
export default getData;
