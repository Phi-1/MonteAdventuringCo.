
export function processURL() {
    const url = window.location.href.replace(/https*:\/\//, "")
    const segments = url.split("/")
    const route = segments[1]
    let options = undefined
    if (segments.length > 2) {
        options = []
        for (let i = 2; i < segments.length; i++) {
            options.push(segments[i])
        }
    }
    return [route, options]
}

export function navigateToRoute(route) {
    const protocol = window.location.href.match(/https*:\/\//)[0]
    const baseURL = window.location.href.replace(/https*:\/\//, "").split("/")[0]
    window.location.href = `${protocol}${baseURL}/${route}`
}