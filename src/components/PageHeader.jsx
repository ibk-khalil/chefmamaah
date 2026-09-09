export default function PageHeader({ title, crumb }) {
  return (
    <div className="bg-cream-soft border-b border-cream-light">
      <div className="max-w-content mx-auto px-5 md:px-8 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {crumb && <p className="text-sm text-grey-medium mt-2">{crumb}</p>}
      </div>
    </div>
  )
}
