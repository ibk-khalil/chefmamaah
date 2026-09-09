export const WHATSAPP_NUMBER = '2348100923070'

export function waLink(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export const WA_MESSAGES = {
  general:
    "Hello Chef Maamah, I'm interested in the General Culinary Class. I'd like to know more about the next available class.",
  private:
    "Hello Chef Maamah, I'm interested in the Private Culinary Class. I'd like to know more about availability and enrolment.",
  general_link_default:
    "Hello Chef Maamah, I'd like to know more about your culinary classes.",
}
