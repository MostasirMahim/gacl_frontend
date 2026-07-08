This plan outlines the steps required to integrate the static frontend `/restaurant` template with the main backend Django application, enabling multi-restaurant support with dynamic content (menus, sections, items, reviews, testimonials, and banners) managed through a dashboard portal.

> [!WARNING]
> **Preservation of Fields and Styles Disclaimer**:
> 1. **Do not delete any existing fields** in models, serializers, views, or datasets. Maintain all old fields side-by-side with the new fields, even if some old fields are not actively used by the frontend template. Just leave them un-used but fully intact.
> 2. **Do not modify frontend design styles or CSS rules**. The visual layout, styling, classes, and structure of the pages must remain exactly as designed in the mockup. Bind dynamic values where necessary without changing the template's look, feel, or existing unused static data.

---

## User Review Required

> [!IMPORTANT]
> **Database Schema Migrations**: We will introduce significant updates to the `Restaurant` and `RestaurantItem` models, and create three new tables: `RestaurantMenuSection`, `RestaurantTestimonial`, and `RestaurantItemReview`. All schema changes are fully backward-compatible with default values.
> 
> **New Backend App**: A new Django app named `portal_management` will be added to the backend directory to isolate administrative and portal APIs, preparing the system for future modular expansions like events, reservations, and club management.
> 
> **Dynamic Frontend Route Restructuring**: The public restaurant template has been renamed and restructured under `/restaurant` to support dynamic slug-based paths (e.g., `/restaurant/[slug]/menu` and `/restaurant/[slug]/items/[itemSlug]`). 
> 
> **Avoiding Next.js Route Conflicts**: To prevent duplicate dynamic parameter errors (e.g., nesting `[slug]` inside `[slug]`), we propose naming the item route `[itemSlug]` rather than `[slug]` (so the path is `/restaurant/[slug]/items/[itemSlug]`).

---

## Proposed Changes

### 1. Backend Database Schema Updates (App: `restaurant`)

We will enhance the existing models in [models.py](file:///F:/Pepoltek/gacl/updates/backend/restaurant/models.py) to accommodate all fields required by the frontend template.

#### `Restaurant` Model Enhancements
To support dynamic banners, metadata, and restaurant-specific section data:
- **`slug`**: `models.SlugField(max_length=350, unique=True, blank=True, null=True)` (routing slug).
- **`banner_bg_image`**: `models.ImageField(upload_to="restaurant/banners/", blank=True, null=True)` (Hero background image).
- **`banner_title`**: `models.CharField(max_length=300, blank=True, default="")` (Hero title).
- **`banner_description`**: `models.TextField(blank=True, default="")` (Hero description).
- **`about_text`**: `models.TextField(blank=True, default="")` (Custom description for about section).
- **`meta_title` / `meta_description`**: `models.CharField` / `models.TextField` for SEO metadata.
- **`delivery_banner_title`**: `models.CharField(max_length=200, default="30 Minutes Delivery!")`.
- **`delivery_banner_text`**: `models.TextField(blank=True, default="")` (Delivery banner text).
- **`reservation_banner_title`**: `models.CharField(max_length=200, default="Reservation Your Favorite Private Table")`.
- **`reservation_banner_text`**: `models.TextField(blank=True, default="")` (Reservation description).
- **`reservation_banner_launch_menu`**: `models.CharField(max_length=100, default="30+ items")` (Display statistics).
- **`reservation_banner_dinner_menu`**: `models.CharField(max_length=100, default="50+ items")` (Display statistics).
- **`footer_config`**: `models.JSONField(default=dict, blank=True)` (dynamic configuration containing about us, social media, contact info, newsletter, and custom explore links).

#### `RestaurantItem` Model Enhancements
To represent the frontend item details and food menu listing:
- **`slug`**: `models.SlugField(max_length=350, unique=True, blank=True, null=True)`.
- **`sku`**: `models.CharField(max_length=100, blank=True, null=True)`.
- **`stock`**: `models.IntegerField(default=0)` (Track quantity in stock).
- **`half_price`**: `models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)` (Optional half-portion price).
- **`free_bonus`**: `models.CharField(max_length=250, blank=True, null=True, default="")` (e.g. "Free Drinks", "Extra Free Juice").
- **`sub_items`**: `models.CharField(max_length=500, blank=True, default="")` (e.g., "Ricotta / goat cheese / beetroot").
- **`tags`**: `models.JSONField(default=list, blank=True)` (e.g., `["CheesePizza", "Popular"]`).
- **`additional_info`**: `models.JSONField(default=dict, blank=True)` (e.g., `{"Weight": "240 Ton", "Dimensions": "20x30x40 cm"}`).
- **`menu_section`**: `models.ForeignKey('RestaurantMenuSection', on_delete=models.SET_NULL, null=True, blank=True, related_name="items")` (Binds item to a restaurant-specific menu section).

#### [NEW] `RestaurantMenuSection` Model
Enables restaurants to organize items into custom menu sections (e.g., Breakfast, Lunch, Sea Food) with order control and custom side images:
- **`restaurant`**: FK to `Restaurant` (Cascade).
- **`title`**: `models.CharField` (e.g., "Breakfast").
- **`cover_image`**: `models.ImageField(upload_to="restaurant/sections/", blank=True, null=True)` (side banner image).
- **`order`**: `models.PositiveIntegerField(default=0)` (order ranking).
- **`description`**: `models.TextField(blank=True, default="")` (sub-title or section slogan).
- **`layout_type`**: `models.CharField(max_length=50, choices=[('default', 'Default/Tabs'), ('left', 'Left Column'), ('right', 'Right Column')], default='default')` (layout configuration).

#### [NEW] `RestaurantTestimonial` Model
Allows dynamic testimonials per restaurant:
- **`restaurant`**: FK to `Restaurant` (Cascade).
- **`name`**: `models.CharField` (client name).
- **`designation`**: `models.CharField` (client title, e.g. "CEO", "Client").
- **`rating`**: `models.PositiveSmallIntegerField(default=5)` (1 to 5 stars).
- **`title`**: `models.CharField` (e.g., "Delicious Food").
- **`text`**: `models.TextField` (review quote).

#### [NEW] `RestaurantItemReview` Model
Allows public reviews for specific food menu items:
- **`item`**: FK to `RestaurantItem` (Cascade).
- **`member`**: FK to `member.Member` (Protect).
- **`rating`**: `models.PositiveSmallIntegerField(default=5)`.
- **`review_text`**: `models.TextField()`.

---

### 2. New Backend App: `portal_management`

We will create a new backend app using `python manage.py startapp portal_management`.

#### Configuration:
- Register the app in `config/settings/base.py` (or default settings).
- Add the url routing to `config/urls.py`: `path('api/portal-management/', include('portal_management.urls'))`.

#### API Endpoints in `portal_management`
We will expose CRUD endpoints for the dashboard tabs:
- **Menu Sections**:
  - `GET /api/portal-management/v1/restaurants/<restaurant_id>/sections/`
  - `POST /api/portal-management/v1/restaurants/<restaurant_id>/sections/`
  - `PATCH /api/portal-management/v1/restaurants/sections/<section_id>/`
  - `DELETE /api/portal-management/v1/restaurants/sections/<section_id>/`
- **Testimonials**:
  - `GET /api/portal-management/v1/restaurants/<restaurant_id>/testimonials/`
  - `POST /api/portal-management/v1/restaurants/<restaurant_id>/testimonials/`
  - `PATCH /api/portal-management/v1/testimonials/<testimonial_id>/`
  - `DELETE /api/portal-management/v1/testimonials/<testimonial_id>/`
- **Reviews**:
  - `GET /api/portal-management/v1/restaurants/<restaurant_id>/reviews/` (List reviews for all items of this restaurant)
  - `POST /api/portal-management/v1/items/<item_id>/reviews/` (Submit review)
  - `PATCH /api/portal-management/v1/reviews/<review_id>/` (Approve/Reject/Modify review visibility)
  - `DELETE /api/portal-management/v1/reviews/<review_id>/` (Remove review)

---

### 3. Updating Old Backend APIs (`restaurant` App)

Refactor existing serializers and views in [serializers.py](file:///F:/Pepoltek/gacl/updates/backend/restaurant/serializers.py) and [views.py](file:///F:/Pepoltek/gacl/updates/backend/restaurant/views.py):
- **`RestaurantSerializer` & `RestaurantUpdateSerializer`**: Add all newly introduced fields to validate and persist input.
- **`RestaurantItemSerializer` & `RestaurantItemUpdateSerializer`**: Incorporate validation for new fields: `slug`, `sku`, `stock`, `half_price`, `free_bonus`, `sub_items`, `tags`, `additional_info`, and `menu_section`.
- **New Public Portal Endpoint**:
  - `GET /api/restaurants/v1/public/by-slug/<slug>/menu/`
    Returns a unified payload containing:
    1. Restaurant core info (banners, reservation/delivery info, SEO).
    2. Menu sections sorted by `order`.
    3. Restaurant items pre-grouped inside their corresponding `menu_section`.
    4. Active testimonials list.
    This layout allows the frontend to fetch all required page content in a single query.

---

### 4. Frontend Dynamic Routing (Public Portal `/restaurant`)

Currently, [menu/page.tsx](file:///F:/Pepoltek/gacl/updates/frontend/src/app/restaurant/[slug]/menu/page.tsx) and [items/[slug]/page.tsx](file:///F:/Pepoltek/gacl/updates/frontend/src/app/restaurant/[slug]/items/[slug]/page.tsx) contain static mockup components. We will restructure the items directory to `items/[itemSlug]` to avoid parameter key conflicts.

```
src/app/restaurant/
├── page.tsx                           # Redirects to default restaurant slug (or list of restaurants)
└── [slug]/
    ├── page.tsx                       # Restaurant Landing Page (Hero banner, Description)
    ├── menu/
    │   └── page.tsx                   # Dynamic Food Menu listing (Breakfast, Lunch, etc.)
    └── items/
        └── [itemSlug]/
            └── page.tsx               # Dynamic Item Detail Page (sku, stock, tags, reviews list)
```

#### Code Updates inside components:
- **`BreadCrumb.tsx`**: Modify the component to accept dynamic title and custom background images fetched from the backend API.
- **`FoodMenuV4.tsx` & `FoodMenuV5.tsx`**: Replace the static import of `FoodCartV4Data.json` with a server/client side fetch from `/api/restaurants/v1/public/by-slug/[slug]/menu/`, map sections dynamically, and pass item details to `SingleFoodMenuTabV3`.
- **`SingleFoodMenuTabV3.tsx`**: Display `sub_items` (leftInfo), `free_bonus` (rightInfo), `half_price` (price), and `selling_price` (priceFull). Update links to dynamically route to `/restaurant/[slug]/items/[itemSlug]`.
- **`ShopSinglePageContent.tsx`**: Retrieve parameters from `/api/restaurants/v1/restaurants/items/by-slug/[itemSlug]/detail/` instead of `ProductData.json`. Bind `productTag`, `sku`, `stock` status, and load custom description.
- **`ShopProductTab.tsx`**: Read reviews from backend item reviews endpoint instead of using hardcoded mock reviews, and link `ProductReviewForm` to submit reviews directly to the item.
- **`TestimonialV1.tsx`**: Populate the Swiper slide with dynamic data from `/api/restaurants/v1/public/by-slug/[slug]/menu/` testimonials list.
- **`ReservationV1.tsx` & `DeliveryV1.tsx`**: Read customizable title, description, and display statistics from the active restaurant object.

---

### 5. Frontend Dashboard Portal Manage Section

Path: `F:\Pepoltek\gacl\updates\frontend\src\app\(dashboard)\(restaurant_management)`

We will expand the dashboard to handle the new dynamic parameters under `restaurants/[id]/page.tsx` by wrapping the workspace inside a modern tabbed layout (`menu`, `testimonial`, `reviews`, `restaurants`):

- **Restaurants Tab**:
  Provides a unified edit page representing the `/restaurants/add` fields but pre-filled. Allows modifying details, hero backgrounds, SEO tags, delivery text, and reservation options.
- **Menu Tab**:
  Allows adding, deleting, and re-ordering menu sections. Shows sections as expandable cards where administrators can manage item positioning (`serial`) inside the section.
- **Testimonials Tab**:
  A list of customer feedback entries with options to create, edit ratings/text, and toggle visibility on the public menu.
- **Reviews Tab**:
  Shows user-submitted item reviews. Managers can approve review visibility or update ratings and review texts.

#### Forms Updates:
- **`/restaurants/add` ([AddRestaruantForm.tsx](file:///F:/Pepoltek/gacl/updates/frontend/src/components/restaurant/AddRestaruantForm.tsx))**: Add fields for banners, SEO details, about us texts, and custom delivery/reservation banner titles/descriptions.
- **`/restaurants/items/add` ([RestaurantItemAddForm.tsx](file:///F:/Pepoltek/gacl/updates/frontend/src/components/restaurant/RestaurantItemAddForm.tsx))**: Add inputs for `slug`, `sku`, `stock`, `half_price`, `free_bonus`, `sub_items`, `tags` (combobox/multi-select), `additional_info` (dynamic key-value adder), and `menu_section` (dropdown fetched from the active restaurant's sections list).

---

## Verification Plan

### Automated APIs Verification
- **Create Restaurant with New Fields**:
  ```bash
  curl -X POST http://localhost:8000/api/restaurants/v1/restaurants/ \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Steakhouse Prime",
      "slug": "steakhouse-prime",
      "banner_title": "Best Steaks in Town",
      "banner_description": "Grilled to perfection",
      "status": "open",
      "cuisine_type": 1,
      "restaurant_type": 1
    }'
  ```
- **Create Menu Section**:
  ```bash
  curl -X POST http://localhost:8000/api/portal-management/v1/restaurants/1/sections/ \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Chef Specials",
      "order": 1
    }'
  ```
- **Create Restaurant Item with New Fields**:
  ```bash
  curl -X POST http://localhost:8000/api/restaurants/v1/restaurants/items/ \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Wagyu Ribeye",
      "slug": "wagyu-ribeye",
      "unit": "portion",
      "unit_cost": "45.00",
      "selling_price": "95.00",
      "half_price": "55.00",
      "free_bonus": "Complimentary Wine",
      "sub_items": "Asparagus / Garlic Mash",
      "sku": "WAGYU-RIB-01",
      "stock": 15,
      "category": 1,
      "restaurant": 1,
      "menu_section": 1
    }'
  ```
- **Fetch Public Portal Unified Menu**:
  ```bash
  curl http://localhost:8000/api/restaurants/v1/public/by-slug/steakhouse-prime/menu/
  ```

### Manual Verification
- Deploy backend migrations (`python manage.py makemigrations` and `python manage.py migrate`).
- Open frontend dashboard `/restaurants/[id]` and verify each tab (`restaurants`, `menu`, `testimonial`, `reviews`) opens and edits data successfully.
- Go to `/restaurant/steakhouse-prime/menu` on public page and verify that all sections, side images, item details (full/half price, sub items, free drinks), testimonials, and customized reservation details load correctly from the backend database.

---

## Next Step Implementation Overview: Ordering Flow

Once dynamic rendering is complete, the ordering integration will support two distinct checkout options directly on the item details page:

1. **Member Direct Ordering**:
   - Authenticated members select items, choose quantities, specify options (like spice level), and checkout.
   - The frontend calls `POST /api/restaurants/v1/restaurants/orders/` to place the order.
   - Billed automatically using the member's account invoice system.
2. **Guest OTP Conditional Ordering**:
   - Guest users place an order by referencing a valid host Member ID.
   - Placing the order initiates `POST /api/restaurants/v1/restaurants/orders/` which triggers `otp_code` generation and sends it to the member's registered device.
   - The checkout page enters a verification state.
   - Once verified via `POST /api/restaurants/v1/restaurants/orders/<order_id>/verify-otp/`, the order is confirmed and sent to the kitchen dashboard, with billing assigned to the host member.
