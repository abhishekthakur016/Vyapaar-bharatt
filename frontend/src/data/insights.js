export const insightCategories = [
  {
    id: "market-insights",
    name: "Market Insights",
    description:
      "Understand market movements, demand patterns, pricing trends, and business opportunities.",
    icon: "chart",
  },
  {
    id: "industry-trends",
    name: "Industry Trends",
    description:
      "Explore upcoming industry trends, technologies, and changing buyer requirements.",
    icon: "trend",
  },
  {
    id: "sourcing-guides",
    name: "Sourcing Guides",
    description:
      "Practical guides to help businesses find reliable suppliers and source products.",
    icon: "book",
  },
  {
    id: "business-tips",
    name: "Business Tips",
    description:
      "Useful ideas for improving operations, supplier relationships, sales, and growth.",
    icon: "bulb",
  },
  {
    id: "trade-export",
    name: "Trade & Export",
    description:
      "Learn about trade opportunities, exports, markets, and growing your business globally.",
    icon: "globe",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description:
      "Discover manufacturing insights, industrial capabilities, quality, and production trends.",
    icon: "factory",
  },
]

export const insights = [
  {
    id: 1,
    category: "Market Insights",
    categoryId: "market-insights",
    title: "How to Find the Right B2B Supplier for Your Business",
    excerpt:
      "Key factors to consider when evaluating suppliers, comparing capabilities, pricing, quality, and reliability.",
    content: `
Finding the right B2B supplier is one of the most important decisions for a growing business.

A reliable supplier can help you maintain consistent product quality, manage costs, and fulfil customer orders on time.

Before choosing a supplier, businesses should evaluate several important factors.

### 1. Product Quality

Check whether the supplier can consistently meet your required specifications and quality standards.

Ask for product samples, specifications, certifications, and previous supply experience where appropriate.

### 2. Pricing

Do not evaluate suppliers only on the lowest price.

Consider the complete sourcing cost, including minimum order quantities, transportation, packaging, payment terms, and delivery.

### 3. Production or Supply Capacity

Make sure the supplier can handle your expected order volume.

A supplier that works well for a small order may not necessarily have the capacity to fulfil larger requirements.

### 4. Delivery Reliability

Delivery timelines are critical for B2B businesses.

Ask suppliers about lead times, dispatch schedules, logistics arrangements, and their ability to handle urgent requirements.

### 5. Communication

Good communication makes supplier relationships much easier.

Choose suppliers who respond clearly, provide complete information, and are willing to discuss your requirements.

### Conclusion

The right supplier is not always the cheapest supplier.

Look at quality, reliability, capacity, pricing, delivery, and communication together before making your final sourcing decision.
`,
  },
  {
    id: 2,
    category: "Industry Trends",
    categoryId: "industry-trends",
    title: "How Better Supplier Discovery Can Reduce Sourcing Time",
    excerpt:
      "Explore how structured supplier discovery can make procurement faster, easier, and more efficient.",
    content: `
Supplier discovery can take a significant amount of time when businesses depend on scattered information and manual research.

A structured B2B marketplace can simplify this process by bringing suppliers, products, categories, and business information together.

### Search Faster

Instead of searching across multiple sources, buyers can start with a specific product or category.

### Compare Suppliers

Supplier comparison helps buyers evaluate different businesses based on relevant factors such as location, capabilities, experience, and product availability.

### Understand Requirements

A clear requirement helps suppliers understand exactly what a buyer needs.

This can improve the quality of responses and reduce unnecessary communication.

### Request Quotes

Sending a structured request for quotation gives suppliers the information needed to prepare a quote.

### Build Long-Term Relationships

Supplier discovery should not end with the first transaction.

Reliable suppliers can become long-term business partners as purchasing requirements grow.

### Conclusion

Better supplier discovery can help businesses spend less time searching and more time evaluating the right opportunities.
`,
  },
  {
    id: 3,
    category: "Trade & Export",
    categoryId: "trade-export",
    title: "Growing Your Business Through New B2B Trade Opportunities",
    excerpt:
      "Learn how businesses can explore new markets, connect with buyers, and identify new trade opportunities.",
    content: `
Business growth often comes from finding new customers and entering new markets.

B2B trade platforms can help businesses discover opportunities beyond their existing customer network.

### Expand Your Market

Businesses can explore new regions and industries where their products or services may be relevant.

### Improve Business Visibility

A complete supplier profile can make it easier for potential buyers to understand what a business offers.

### Showcase Products

Detailed product information, specifications, pricing information, and availability can help buyers evaluate products more efficiently.

### Respond to Requirements

Buyer requirements provide an opportunity for suppliers to identify relevant demand and submit quotations.

### Build Trust

Clear business information, communication, product quality, and reliable fulfilment all contribute to stronger business relationships.

### Conclusion

Expanding into new B2B markets requires consistent visibility, reliable relationships, and a clear understanding of buyer requirements.
`,
  },
  {
    id: 4,
    category: "Sourcing Guides",
    categoryId: "sourcing-guides",
    title: "A Practical Guide to Comparing B2B Suppliers",
    excerpt:
      "Understand the key points businesses should check before selecting a supplier.",
    content: `
Comparing suppliers properly can help buyers make more informed sourcing decisions.

### Compare Product Specifications

Make sure the products being compared actually meet the same requirements.

### Check Minimum Order Quantity

MOQ can significantly affect the total sourcing cost, especially for smaller businesses.

### Compare Delivery

Consider lead times, delivery locations, and transportation requirements.

### Evaluate Supplier Experience

Business experience and industry specialization can be useful factors when evaluating suppliers.

### Review Communication

A supplier that understands your requirement and communicates clearly can make the procurement process easier.

### Final Check

Create a simple comparison of price, quality, MOQ, delivery, and supplier capabilities before making your decision.
`,
  },
  {
    id: 5,
    category: "Business Tips",
    categoryId: "business-tips",
    title: "5 Ways to Improve Your B2B Procurement Process",
    excerpt:
      "Simple ways businesses can organize purchasing and make supplier management more efficient.",
    content: `
A well-organized procurement process can improve purchasing efficiency and supplier relationships.

### 1. Define Requirements Clearly

Specify product, quantity, specifications, delivery location, and required timeline.

### 2. Maintain Multiple Supplier Options

Having several qualified suppliers can reduce dependency on a single source.

### 3. Compare Quotes

Review quotes using consistent criteria instead of comparing only headline prices.

### 4. Track Supplier Performance

Monitor delivery reliability, quality, communication, and fulfilment.

### 5. Build Long-Term Relationships

Strong supplier relationships can make future sourcing faster and more predictable.

### Conclusion

A structured procurement process gives businesses better visibility and control over their purchasing decisions.
`,
  },
  {
    id: 6,
    category: "Manufacturing",
    categoryId: "manufacturing",
    title: "What Businesses Should Check Before Choosing a Manufacturer",
    excerpt:
      "Important factors to consider when evaluating manufacturing partners for your business.",
    content: `
Choosing a manufacturing partner requires more than checking the quoted price.

### Manufacturing Capability

Confirm that the manufacturer has the equipment, technology, and expertise required for your product.

### Production Capacity

Understand current production capacity and whether the manufacturer can scale with your business.

### Quality Processes

Ask about quality checks, production processes, specifications, and applicable certifications.

### Lead Time

Discuss production timelines before placing an order.

### Customization

If your product requires customization, make sure the manufacturer has experience with similar requirements.

### Conclusion

The right manufacturing partner should be evaluated on capability, quality, capacity, lead time, and communication.
`,
  },
]

export function getInsightById(id) {
  return insights.find((insight) => String(insight.id) === String(id))
}