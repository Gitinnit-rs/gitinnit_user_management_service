import axios from "axios";

// @ts-ignore
export const resolveAccessToken = async (req, res, next) => {
  if (req.artist_id) {
    delete req.artist_id;
  }
  console.log(req.body);
  if (!req.body.access_token) {
    res.status(400).send("No access token found");
    return;
  }
  const github_url = "https://api.github.com/user";
  const { data, status } = await axios.get(github_url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + req.body.access_token,
    },
  });
  if (status !== 200) {
    res.status(400).send("Unable to get user");
    return;
  }
  delete req.body.access_token;
  req.body.artist_id = data.id;
  next();
};