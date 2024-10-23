import {MenuItem} from "@/components/MenuItem";

export function Menu() {
    return (
        <div className={'nav nav-pills flex-column'}>
            <MenuItem path={'/dashboard'} title={'Dashboard'}></MenuItem>
            <MenuItem path={'/posts'} title={'Posts'}></MenuItem>
            <MenuItem path={'/albums'} title={'Albums'}></MenuItem>
            <MenuItem path={'/photos'} title={'Photos'}></MenuItem>
        </div>
    )
}