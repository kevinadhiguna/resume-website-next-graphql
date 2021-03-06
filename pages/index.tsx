import Head from "next/head";
import { useQuery, gql } from "@apollo/client";
import { format } from "date-fns";
import { print } from "graphql/language/printer";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import prismStyle from "react-syntax-highlighter/dist/cjs/styles/prism/xonokai";
import styles from "../styles/Home.module.css";

const RESUME_QUERY = gql`
	query KevinAdhiguna {
		bio {
			name
			tagline
			email
			objective
			github
			website
			linkedin
		}
		positions {
			id
			title
			company
			location
			startDate
			endDate
			years
			months
			achievements
		}
	}
`;

export default function Home() {
	const { loading, error, data } = useQuery(RESUME_QUERY);

	if (error) {
		return <span>Error... something went wrong..</span>;
	}

	if (loading) {
		return (
			<header className={styles.header}>
				<h1>Kevin Adhiguna</h1>
				<h2>currently making magic...</h2>
			</header>
		);
	}

	const { bio, positions } = data;

	return (
		<>
			<Head>
				<title>{bio.name}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className={styles.header}>
				<h1>{bio.name}</h1>
				<h2>{bio.tagline}</h2>
			</header>

			<div className={styles.split}>
				<div className={styles.left}>
					<h2>Contact</h2>
					<p>
						<strong>Email</strong>{" "}
						<a href={`mailto:${bio.email}`} className={styles.link}>{bio.email}</a>
					</p>
					<p>
						<strong>Website</strong>{" "}
						<a href={bio.website} className={styles.link}>{new URL(bio.website).host}</a>
					</p>
					<p>
						<strong>Github</strong>{" "}
						<a href={bio.github} className={styles.link}>{bio.github.replace("https://", "")}</a>
					</p>
					<p>
						<strong>LinkedIn</strong>{" "}
						<a href={bio.linkedin} className={styles.link}>{bio.linkedin.replace("https://", "")}</a>
					</p>

					<SyntaxHighlighter language="graphql" style={prismStyle}>
						{print(RESUME_QUERY)}
					</SyntaxHighlighter>
				</div>

				<div className={styles.right}>
					<h2>Objective</h2>
					<p>{bio.objective}</p>

					<h2>My Experiences</h2>
					{positions.map((position) => {
						const length = [
							position.years > 0 ? `${position.years} yrs` : null,
							position.months > 0 ? `${position.months} mths` : null,
						]
							.filter((str) => str)
							.join(" ");

						return (
							<div key={position.id}>
								<h3>{position.title}</h3>
								<p className={styles.light}>
									{position.company} | {position.location}
								</p>
								<p className={styles.light}>
									{format(new Date(position.startDate), "MMM yyyy")} -{" "}
									{position.endDate
										? format(new Date(position.endDate), "MMM yyyy")
										: "Current"}{" "}
									({length})
								</p>
								<ul className={styles.achievement}>
									{position.achievements.map((achievement) => (
										<li key={achievement}>{achievement}</li>
									))}
								</ul>
							</div>
						);
					})}
				</div>
			</div>

			{/* <pre>
				{
					// Added (...null, 2...) for indentation and line break }
					// JSON.stringify(data) works well also
				}
				{JSON.stringify(data, null, 2)}
			</pre> */}
		</>
	);
}
