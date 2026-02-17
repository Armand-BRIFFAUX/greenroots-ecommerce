import dotenv from "dotenv";
dotenv.config({ path: "../.env" });


console.log("Ma clé Perenual :", process.env.PERENUAL_TOKEN);

const token = process.env.PERENUAL_TOKEN;

const testPerenual = async () => {
  try {
    const url = `https://perenual.com/api/species-list?key=${token}&q=oak`;
    console.log("URL utilisée :", url);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("Erreur :", err);
  }
};

testPerenual();


