import axios from "axios"

async function getRecipe() {
  try {
    const res = await axios.get('https://api.api-ninjas.com/v2/recipe?title=lentil soup', {headers: {
        "X-Api-Key": "yCKugUW90PAJwehGz/bdCg==h6uClctVYtwkkXgu"
    }});
    console.log(res.data[0])
    return res.data[0];
  } catch (err) {
    return null;
  }
}

export { getRecipe };