'use client'
import React, { useState, useEffect } from 'react';
import '../styles/styles.css';

export default function Cocktails() {
    const [ingredientQuery, setIngredientQuery] = useState('');
    const [cocktailQuery, setCocktailQuery] = useState('');
    const [cocktails, setCocktails] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [cocktail, setCocktail] = useState(null);
    const [showIngredients, setShowIngredients] = useState(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list");
            const data = await response.json();
            setIngredients(data.drinks.map(item => item.strIngredient1));};
            fetchIngredients(); 
        }, []);

    const handleIngredientChange = (e) => {
        setIngredientQuery(e.target.value);
    };

    const handleCocktailChange = (e) => {
        setCocktailQuery(e.target.value);
    };

    const handleSubmit = async (e, query) => {
        e.preventDefault();
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${query}`);
        const data = await response.json();
        setCocktails(data.drinks);
    };

    const handleRandomCocktail = async () => {
        const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const data = await response.json();
        setCocktail(data.drinks[0]);
    };

    const handleSearchCocktail = async () => {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailQuery}`);
        const data = await response.json();
        setCocktail(data.drinks[0]);
        
    };

    const handleToggleIngredients = () => {
        setShowIngredients(!showIngredients);
    };
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [breweryList, setBreweryList] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    //fetching brewery api by city and state
    useEffect(() => {
        const fetchBreweryList = async () => {
            try {
                const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${city}&by_state=${state}&per_page=10`);
                if (!response.ok) {
                    throw new Error('Failed to fetch information');
                }
                const data = await response.json();
                //filters out any closed breweries and adds rest to brewery list
                const filteredBreweries = data.filter((brewery: { id: number, name: string, brewery_type: string }) => brewery.brewery_type !== 'closed');
                setBreweryList(filteredBreweries);
                setError(null);
            } catch (error) {
                //catching errors
                setError('Error fetching data');
                console.error('Error fetching data: ', error);
            }
        };

        // Fetch data only if brewery list is not empty
        if (city.trim() !== '' && state.trim() !== '') {
            fetchBreweryList();
        } else {
        // reset brewerly list if empty
            setBreweryList([]);
        }
    }, [city, state]);


    return (
        <div class="container">
        <div>
            <h1>Welcome to Crafted Pours</h1>
            <h2>Choose to navigate between a cocktail or a brewery:</h2> 
            <h2><a href="#Cocktail">Cocktail Explorer</a></h2>
            <h2><a href="#Brewery">Brewery Locator</a></h2>
            <img src="https://static.vecteezy.com/system/resources/previews/023/797/850/non_2x/set-of-cocktails-summer-illustration-of-classical-drinks-in-different-types-of-glasses-illustration-of-summer-cocktails-banner-with-soft-and-alcohol-drinks-vector.jpg" alt="Cocktails illustration" />
            <section id="Cocktail">
        <h2>Cocktail Explorer</h2>     
        <h2>Find inspiration for your next drink!</h2>
            <ul>
                <li>Don't know where to start? Click for a random cocktail!</li>
                <li>Want to find something you know you'll like? </li>
                <li>1. Display a list of ingredients</li>
                <li>2. Search for cocktails that include that ingredient</li>
                <li>3. Search by cocktail name to find instructions on how to make it</li>
                </ul>
            {showIngredients && (
                <ul>
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            )}

            <button class="skinny" onClick={handleToggleIngredients}>
                {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
            </button>

            <button class="skinny" onClick={handleRandomCocktail}>Random Cocktail</button>

            <form onSubmit={(e) => handleSubmit(e, ingredientQuery)}>
                <input
                    type="text"
                    placeholder="Search by Ingredient..."
                    value={ingredientQuery}
                    onChange={handleIngredientChange}
                />
                <button type="submit">Search</button>
            </form>

            {cocktails.length > 0 && (
                <ul>
                    {cocktails.map((cocktail, index) => (
                        <li key={index}>{cocktail.strDrink}</li>
                    ))}
                </ul>
            )}

            <input
                type="text"
                placeholder="Search by Cocktails for Instructions..."
                value={cocktailQuery}
                onChange={handleCocktailChange}
            />

            <button onClick={handleSearchCocktail}>Search</button>

            {cocktail && (
                <div>
                    <h2>{cocktail.strDrink}</h2>
                    <p>{cocktail.strInstructions}</p>
                </div>
            )}
            </section>
        <div>    
        <section id="Brewery">
            <h2>Brewery Locator - United States</h2>
            <img src="https://media.istockphoto.com/id/945674442/vector/beer-glass-bottle-and-can-types-craft-beer-calligraphy-design-and-minimal-flat-vector.jpg?s=612x612&w=0&k=20&c=A5xFP2cTrQt8LlZblxFBc-KSVPJR0SSVVSBQB7-0nYE=" alt="Brewery Illustration"/>
            <input
                className="input-container"
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={(e) => setCity(e.target.value.toLowerCase().replace(/\s/g, '_'))}
            />
            <input
                className="input-container"
                type="text"
                placeholder="Enter State"
                value={state}
                onChange={(e) => setState(e.target.value.toLowerCase().replace(/\s/g, '_'))}
            />
            <ul>
                {breweryList.map((brewery: any) => (
                    <div key={brewery.id}>
                    <h2>{brewery.name}</h2>
                    <p className="brewery-information">{brewery.street}</p>
                    <p className="brewery-information">{brewery.city}, {brewery.state}</p>
                    <p className="link">{brewery.website_url}</p>
                    <p className="brewery-information">Type: {brewery.brewery_type}</p>
                    </div>
                ))}
            </ul> 
            &nbsp;
            </section>
        </div>
        </div> 
        </div>   
           
        
    );
}