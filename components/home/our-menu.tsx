import Image from "next/image";
import Icon from "../ui/app-icon";
import { Button } from "../ui/button";

const OurMenu = () => {
  // const navigate = useNavigate();

  const menuCategories = [
    {
      id: 1,
      name: "Burgers",
      description: "Juicy, handcrafted burgers with premium ingredients",
      image: "https://images.unsplash.com/photo-1603322617458-a6ca4d3e55c0",
      imageAlt:
        "Gourmet beef burger with lettuce, tomato, cheese, and sesame seed bun on wooden cutting board",
      itemCount: 12,
      featured: true,
      color: "bg-primary",
      textColor: "text-primary-foreground",
    },
    {
      id: 2,
      name: "Pizza",
      description: "Wood-fired pizzas with authentic Italian flavors",
      image: "https://images.unsplash.com/photo-1664683591826-12d7d41543c1",
      imageAlt:
        "Traditional Italian pizza with melted mozzarella, fresh basil, and tomato sauce on wooden table",
      itemCount: 8,
      featured: false,
      color: "bg-accent",
      textColor: "text-accent-foreground",
    },
    {
      id: 3,
      name: "Pasta",
      description: "Fresh pasta dishes made with traditional recipes",
      image: "https://images.unsplash.com/photo-1695300466208-5c58a043dedb",
      imageAlt:
        "Creamy pasta dish with herbs and parmesan cheese in white ceramic bowl",
      itemCount: 10,
      featured: false,
      color: "bg-warning",
      textColor: "text-warning-foreground",
    },
    {
      id: 4,
      name: "Salads",
      description: "Fresh, healthy salads with seasonal ingredients",
      image: "https://images.unsplash.com/photo-1670650850872-652ed66a9097",
      imageAlt:
        "Fresh mixed green salad with colorful vegetables, cherry tomatoes, and dressing in glass bowl",
      itemCount: 6,
      featured: false,
      color: "bg-success",
      textColor: "text-success-foreground",
    },
    {
      id: 5,
      name: "Desserts",
      description: "Indulgent desserts to satisfy your sweet tooth",
      image: "https://images.unsplash.com/photo-1713393280916-a2a888a375c9",
      imageAlt:
        "Decadent chocolate cake slice with berries and powdered sugar on elegant white plate",
      itemCount: 7,
      featured: false,
      color: "bg-secondary",
      textColor: "text-secondary-foreground",
    },
    {
      id: 6,
      name: "Beverages",
      description: "Refreshing drinks, coffee, and specialty beverages",
      image: "https://images.unsplash.com/photo-1657459832576-e42be00462d9",
      imageAlt:
        "Assorted colorful beverages including coffee, smoothies, and fresh juices in various glasses",
      itemCount: 15,
      featured: false,
      color: "bg-muted",
      textColor: "text-muted-foreground",
    },
  ];

  // const handleCategoryClick = (category) => {
  //   navigate("/menu-catalog", { state: { selectedCategory: category?.name } });
  // };

  // const handleViewFullMenu = () => {
  //   navigate("/menu-catalog");
  // };

  return (
    <section id="menu-preview" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Icon name="UtensilsCrossed" size={20} className="text-primary" />
            <span className="text-primary font-body font-medium">OUR MENU</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            Explore Our <span className="text-primary-solid">Delicious</span>{" "}
            Categories
          </h2>

          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            From hearty burgers to fresh salads, discover a world of flavors
            crafted with passion and the finest ingredients.
          </p>
        </div>

        {/* Menu Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {menuCategories?.map((category) => (
            <div
              key={category?.id}
              // onClick={() => handleCategoryClick(category)}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-xl transition-all duration-300 cursor-pointer"
            >
              {/* Featured Badge */}
              {category?.featured && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-body font-bold uppercase tracking-wide flex items-center space-x-1">
                    <Icon name="Star" size={12} />
                    <span>Featured</span>
                  </div>
                </div>
              )}

              {/* Item Count Badge */}
              <div className="absolute top-4 right-4 z-20">
                <div
                  className={`${category?.color} ${category?.textColor} px-3 py-1 rounded-full`}
                >
                  <span className="text-sm font-body font-bold">
                    {category?.itemCount} items
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category?.imageAlt}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-card/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Icon
                      name="ArrowRight"
                      size={24}
                      className="text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {category?.name}
                </h3>

                <p className="text-muted-foreground font-body mb-4 line-clamp-2">
                  {category?.description}
                </p>

                {/* Action */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-body">
                    View all items
                  </span>
                  <Icon
                    name="ArrowRight"
                    size={18}
                    className="text-primary group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <div className="text-center">
          <Button
            variant="tertiary"
            size="lg"
            // onClick={handleViewFullMenu}
            iconName="Menu"
            className="px-8 py-4 hover:scale-105 transition-transform duration-200 shadow-warm-lg"
          >
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OurMenu;
