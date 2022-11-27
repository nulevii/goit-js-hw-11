import Notifix from 'notiflix';
import axios from 'axios';

const getData = async link => {
  try {
    const data = await axios.get(link);
    return data;
  } catch (error) {
    console.error(error.message);
  }
};
export default getData;
