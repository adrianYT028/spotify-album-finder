import "./App.css";
import {
  FormControl,
  InputGroup,
  Container,
  Button,
  Card,
  Row,
} from "react-bootstrap";
import { useState } from "react";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [albums, setAlbums] = useState([]);

  async function search() {
    setError("");
    if (!searchInput || searchInput.trim() === "") {
      setError("Please enter an artist name");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchInput)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(errorData.error || 'Search failed');
        setAlbums([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setAlbums(data.albums || []);
    } catch (err) {
      setError(err.message || "Search failed");
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="hero">
        <div className="hero-inner">
          <h2 className="fancy-text">Search for all the albums of your fav artist</h2>

          <div className="search-group">
            <InputGroup>
              <FormControl
                placeholder="Search For Artist"
                type="input"
                aria-label="Search for an Artist"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    search();
                  }
                }}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <Button onClick={search}>Search</Button>
            </InputGroup>
          </div>

          {loading && <p style={{ color: '#fff', marginTop: 12 }}>Loading…</p>}
          {error && <p style={{ color: '#ffb4b4', marginTop: 12 }}>{error}</p>}

        </div>
      </div>

      <Container>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          {albums.map((album) => {
            return (
              <Card
                key={album.id}
                style={{
                  backgroundColor: "white",
                  margin: "10px",
                  borderRadius: "5px",
                  marginBottom: "30px",
                }}
              >
                <Card.Img
                  width={200}
                  src={album.images[0].url}
                  style={{
                    borderRadius: "4%",
                  }}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      whiteSpace: "wrap",
                      fontWeight: "bold",
                      maxWidth: "200px",
                      fontSize: "18px",
                      marginTop: "10px",
                      color: "black",
                    }}
                  >
                    {album.name}
                  </Card.Title>
                  <Card.Text
                    style={{
                      color: "black",
                    }}
                  >
                    Release Date: <br /> {album.release_date}
                  </Card.Text>
                  <Button
                    href={album.external_urls.spotify}
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    Album Link
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </Row>
      </Container>
    </>
  );
}

export default App; 
