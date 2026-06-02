export const socialMediaLinks = [
    {
        platform: 'Twitter',
        selector: '.social_twitter a',
        expectedHref: 'https://x.com/saucelabs',
    },
    {
        platform: 'Facebook',
        selector: '.social_facebook a',
        expectedHref: 'https://www.facebook.com/saucelabs',
    },
    {
        platform: 'LinkedIn',
        selector: '.social_linkedin a',
        expectedHref: 'https://www.linkedin.com/company/sauce-labs/',
    },
];

export const sortOptions = {
    defaultLabel: 'Name (A to Z)',
    priceLowToHighLabel: 'Price (low to high)',
    priceLowToHighValue: 'lohi',
};
