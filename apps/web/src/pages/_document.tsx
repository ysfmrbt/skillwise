import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              try {
                const theme = localStorage.getItem('skillwise-ui-theme') || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
					}}
				/>
			</Head>
			<body className='antialiased'>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
