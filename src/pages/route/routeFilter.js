import React, { Component } from 'react';
import RouteFilterTab from './routeFilterTab';

class RouteFilter extends Component {
    render() {
        return (
            <div>
                {/* Your existing navbar would be rendered here automatically */}
                <RouteFilterTab />
            </div>

        );
    }
}

export default RouteFilter;