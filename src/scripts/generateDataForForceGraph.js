const csv = require("csvtojson");
const fs = require("fs");

async function readCSV(filePath) {
  const jsonObj = await csv().fromFile(filePath);
  return jsonObj;
}

async function run() {
  try {
    const filePath = "sheets/visualization_data_movie_actors_v1.csv";
    const json = await readCSV(filePath);
    const dataForForceGraph = makeNodesAndLinks(json);
    await fs.writeFile(
      "src/dataForMoviesAndActors.js",
      `
      const data = ${JSON.stringify(dataForForceGraph)};
      export default data;
    `,
      console.log
    );
  } catch (e) {
    console.log(e);
  }
}

function getUniqueMovies(json) {
  const movies = json.map(j => j["Movie"]);
  const uniqueMovies = Array.from(new Set(movies));

  const actors = json.map(j => j["Actor"]);
  const uniqueActors = Array.from(new Set(actors));

  return [uniqueMovies, uniqueActors];
}

function makeNodesAndLinks(json) {
  const [uniqueMovies, uniqueActors] = getUniqueMovies(json);
  const uniqeNodes = [...uniqueMovies, ...uniqueActors];

  const movieNodes = uniqueMovies.map((m, i) => ({ name: m, group: 1 }));
  const actorNodes = uniqueActors.map((a, i) => ({ name: a, group: 2 }));

  const links = json.map(i => ({
    source: uniqeNodes.indexOf(i["Movie"]),
    target: uniqeNodes.indexOf(i["Actor"]),
    value: Number(i["Strength"]) * 10
  }));

  return {
    nodes: [...movieNodes, ...actorNodes],
    links
  };
}

run();
