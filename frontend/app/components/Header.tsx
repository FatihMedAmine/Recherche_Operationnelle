import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          OptimLinéaire
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/problem-input" className="hover:underline">
              Nouveau Problème
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header

