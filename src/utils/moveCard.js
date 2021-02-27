export const moveCard = (
  state,
  source,
  destination,
  sourceIndex = 0,
  destIndex = destination.length,
) => {
  const card = [...(state.cards[source] || [])].find(
    (c, i) => i === sourceIndex,
  )
  const newSource = [...(state.cards[source] || [])].filter(
    (c, i) => i !== sourceIndex,
  )

  const dest = state.cards[destination] || []

  return {
    ...state,
    cards: {
      ...state.cards,
      [source]: newSource,
      [destination]: [
        ...dest.slice(0, destIndex),
        card,
        ...dest.slice(destIndex),
      ],
    },
  }
}
