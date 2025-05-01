import ContentBlock from '../../widgets/ContentBlock';
import './HomePage.css'

const HomePage = () => {
    return <div className='list-layout'>
        {[...Array(3)].map((_,i) => {
            return <ContentBlock key={i} elementId={i}/>
        })}
    </div>;
};

export default HomePage;