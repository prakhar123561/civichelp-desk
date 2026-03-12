# CivicHelp Desk Backend

Node.js backend for complaint intake, status tracking, department routing, FAQs, and feedback.

## Run backend

```bash
npm run backend:dev
```

or

```bash
npm run backend:start
```

Default port: `4000` (override with `BACKEND_PORT` or `PORT`).

## API Endpoints

### Health
- `GET /health`

### Metadata
- `GET /api/meta/categories`
- `GET /api/meta/faqs`

### Complaints
- `POST /api/complaints`
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `PATCH /api/complaints/:id/status`
- `POST /api/complaints/:id/assign`
- `POST /api/complaints/:id/feedback`

## Create complaint payload

```json
{
  "citizenName": "Priya Sharma",
  "phoneNumber": "+919999999999",
  "location": "Ward 4, MG Road",
  "category": "road_damage",
  "issueDescription": "Large potholes near bus stop",
  "mediaUrls": ["https://example.com/pothole.jpg"],
  "language": "en"
}
```
