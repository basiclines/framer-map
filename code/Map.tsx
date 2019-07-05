import * as React from "react";
import { PropertyControls, ControlType } from "framer";
import 'apple-mapkit-js'

const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
};

interface Props {
    location: string
    zoom: number
}

export class Map extends React.Component<Props> {

    static defaultProps = {
        location: "San Francisco",
        zoom: 1
    }

    static propertyControls: PropertyControls = {
        location: { type: ControlType.String, title: 'Location' },
        zoom: { type: ControlType.Number, title: 'Zoom' }
    }

    constructor() {
        super()
        this.wrapperRef = React.createRef()
        this.mapInit = false
        this.map = {}
        this.search = {}
    }

    componentDidMount() {
        if (!this.mapInit) {
            this.mapInit = true
            mapkit.init({
                authorizationCallback: function(done) {
                    fetch('https://2i4kp897kg.execute-api.eu-west-2.amazonaws.com/default/MapKitJS-JWT')
                    .then(response => response.json())
                    .then(data => { done(data) })
                }
            });

            this.map = new mapkit.Map(this.wrapperRef.current.id, { showsMapTypeControl: false, showsZoomControl: false, showsScale: false, showsCompass: false });
            this.search = new mapkit.Search({ language: "en-GB" })
            this.performSearch()
        }
    }

    performSearch() {
        this.search.search(this.props.location, (error, data) => {
            let zoom = (this.props.zoom == 0) ? 1 : this.props.zoom;
            let span = new mapkit.CoordinateSpan(0.2 / zoom, 0.2 / zoom);
            let region = new mapkit.CoordinateRegion(data.places[0].coordinate, span);
            this.map.region = region
        })
    }

    componentDidUpdate() {
        this.performSearch()
    }

    render() {
        return (
            <div id={this.props.id} ref={this.wrapperRef} style={style}></div>
        )
    }
}
