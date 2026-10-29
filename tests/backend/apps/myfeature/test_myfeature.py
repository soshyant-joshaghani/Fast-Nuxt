def test_myfeature_root(client):
    response = client.get("/api/v1/myfeature/")
    assert response.status_code == 200
    assert "message" in response.json()
