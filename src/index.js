import { TextControl, Flex, FlexBlock } from "@wordpress/components"
import { InspectorControls } from "@wordpress/block-editor"
import { useState, useEffect } from "react"
import "./index.css" // Import CSS file for styling

wp.blocks.registerBlockType("theplugin/superhero", {
  title: "Superheroes",
  icon: "smiley",
  category: "common",
  attributes: {
    heroName: { type: "string" },
    intelligence: { type: "string" },
    strength: { type: "string" },
    speed: { type: "string" },
    fullName: { type: "string" },
    heroImage: { default: undefined },
  },
  description: "Superheroes Descriptions",
  edit: EditComponent,
  save: function () {
    return null
  },
})

function EditComponent(props) {
  const [heroes, setHeroes] = useState([])
  const [heroOftheDay, setHeroOftheDay] = useState(null)
  const [selectedPublisher, setSelectedPublisher] = useState("Marvel Comics")

  useEffect(() => {
    const getHero = async () => {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json")
        if (!response.ok) {
          throw new Error("Failed to fetch heroes")
        }
        const data = await response.json()
        setHeroes(data)
      } catch (error) {
        console.error("Error fetching heroes:", error)
      }
    }

    getHero()
  }, [])

  function changeHero(hero) {
    props.setAttributes({ heroName: hero.name })
    props.setAttributes({ intelligence: hero.powerstats.intelligence })
    props.setAttributes({ strength: hero.powerstats.strength })
    props.setAttributes({ speed: hero.powerstats.speed })
    props.setAttributes({ fullName: hero.biography.fullName })
    props.setAttributes({ heroImage: hero.images.lg })
  }

  function handlePublisherSelection(publisher) {
    setSelectedPublisher(publisher)
  }

  return (
    <>
      <h3 className="pp_text_center">Choose between Marvel, DC, or Dark Horse Comics</h3>
      <div className="current_hero">
        <i>
          <small>
            {props.attributes.heroName !== "" ? (
              <>
                Currently Selected hero is <strong>{props.attributes.heroName}</strong>
              </>
            ) : (
              <span>No hero is selected.</span>
            )}
          </small>{" "}
        </i>
      </div>

      <Flex className="pp_publisher_flex">
        <FlexBlock>
          <button className={`pp_publisher ${selectedPublisher === "Marvel Comics" ? "selected" : ""}`} onClick={() => handlePublisherSelection("Marvel Comics")}>
            MARVEL
          </button>
        </FlexBlock>
        <FlexBlock>
          <button className={`pp_publisher ${selectedPublisher === "DC Comics" ? "selected" : ""}`} onClick={() => handlePublisherSelection("DC Comics")}>
            DC
          </button>
        </FlexBlock>
        <FlexBlock>
          <button className={`pp_publisher ${selectedPublisher === "Dark Horse Comics" ? "selected" : ""}`} onClick={() => handlePublisherSelection("Dark Horse Comics")}>
            DARK HORSE
          </button>
        </FlexBlock>
      </Flex>
      <Flex>
        <FlexBlock>
          {heroes
            .filter((hero) => hero.biography.publisher == selectedPublisher)
            .map((hero) => (
              <div key={hero.id} className={`hero-button ${props.attributes.heroName === hero.name ? "selected" : ""}`} onClick={() => changeHero(hero)}>
                <TextControl value={hero.name} readOnly={true} />
              </div>
            ))}
        </FlexBlock>
      </Flex>
    </>
  )
}
