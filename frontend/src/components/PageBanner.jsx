function PageBanner({ title, description }) {
  return (
    <div className="bg-[hsl(210,100%,90%)] py-8 px-6 text-center transition-colors duration-300">
      <h1 className="text-3xl font-bold text-[hsl(231,44%,28%)]">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-[hsl(231,44%,28%)]/70">
          {description}
        </p>
      )}
    </div>
  );
}

export default PageBanner;
