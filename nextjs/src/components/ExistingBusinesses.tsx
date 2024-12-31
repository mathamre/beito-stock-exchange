'use client'

import {useEffect, useState} from "react";
import {Business} from "../../types";

export function ExistingBusinesses() {
    const [businesses, setBusinesses] = useState<Business[] | null>(null);

    useEffect(() => {
        fetch('/api/businesses')
            .then(response => response.json())
            .then(data => setBusinesses(data))
    }, [])

    return (
        <div>
            {businesses && businesses.map(business => (
                <div key={business.id}>
                    <p>{business.name}</p>
                </div>))}
            ExistingBusinesses
        </div>
    )
}